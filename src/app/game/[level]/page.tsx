'use client'

import { useAuth } from '@/lib/auth'
import { useSound } from '@/lib/sound'
import { useGameKeyboardShortcuts } from '@/lib/keyboard'
import { useAchievements } from '@/lib/achievements'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { HintSystem } from '@/components/ui/HintSystem'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Home, Trophy, CheckCircle, XCircle, Keyboard } from 'lucide-react'
import toast from 'react-hot-toast'

interface LevelData {
  level: number
  gambar?: string
  jawaban?: string
  makna?: string
  peribahasa?: string
  progress?: {
    completed: boolean
    attempts: number
  }
}

interface AnswerResult {
  correct: boolean
  attempts: number
  levelCompleted: boolean
  answer?: {
    makna: string
    peribahasa: string
  }
}

export default function GamePage() {
  const { user, loading } = useAuth()
  const { playSound } = useSound()
  const { checkAndUnlockAchievements } = useAchievements()
  const router = useRouter()
  const params = useParams()
  const levelParam = params.level as string

  const [levelData, setLevelData] = useState<LevelData | null>(null)
  const [answer, setAnswer] = useState('')
  const [loadingLevel, setLoadingLevel] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [gameStats, setGameStats] = useState({
    currentLevel: parseInt(levelParam),
    totalCorrect: 0,
    currentStreak: 0,
    hintsUsed: 0,
    totalTimePlayed: 0,
    gamesPlayed: 0,
    perfectLevels: 0
  })

  const fetchLevelData = useCallback(async () => {
    try {
      setLoadingLevel(true)
      const response = await fetch(`/api/game/level/${levelParam}`)

      if (response.status === 403) {
        toast.error('Level belum terbuka!')
        router.push('/dashboard')
        return
      }

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Error:', response.status, errorData)
        throw new Error(`Failed to fetch level data: ${response.status} ${errorData}`)
      }

      const data = await response.json()
      setLevelData(data)
      // Store the correct answer for hint system
      if (data.jawaban) {
        setCorrectAnswer(data.jawaban.toUpperCase())
      }
    } catch (error) {
      console.error('Error fetching level:', error)
      toast.error('Gagal memuat level')
    } finally {
      setLoadingLevel(false)
    }
  }, [levelParam, router])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    if (user && levelParam) {
      fetchLevelData()
    }
  }, [user, loading, levelParam, router, fetchLevelData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim() || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/game/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: levelParam,
          answer: answer.trim()
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error - Status:', response.status, 'Response:', errorText)
        throw new Error(`Failed to check answer: ${response.status} ${errorText}`)
      }

      const result: AnswerResult = await response.json()
      setLastResult(result)
      setShowResult(true)

      if (result.correct) {
        playSound('correct')
        toast.success('Selamat! Jawaban benar! 🎉')

        // Update game stats
        setGameStats(prev => ({
          ...prev,
          totalCorrect: prev.totalCorrect + 1,
          currentStreak: prev.currentStreak + 1,
          gamesPlayed: prev.gamesPlayed + 1,
          perfectLevels: prev.perfectLevels + (prev.hintsUsed === 0 ? 1 : 0)
        }))

        // Check for achievements
        const updatedStats = {
          ...gameStats,
          totalCorrect: gameStats.totalCorrect + 1,
          currentStreak: gameStats.currentStreak + 1,
          gamesPlayed: gameStats.gamesPlayed + 1,
          perfectLevels: gameStats.perfectLevels + (gameStats.hintsUsed === 0 ? 1 : 0),
          // When level is completed, make sure currentLevel reflects the highest completed level
          currentLevel: result.levelCompleted
            ? Math.max(gameStats.currentLevel, parseInt(levelParam))
            : gameStats.currentLevel,
        }

        // Check achievements asynchronously
        setTimeout(() => {
          checkAndUnlockAchievements(updatedStats)
        }, 100)

        // Show result for 3 seconds then redirect
        setTimeout(() => {
          if (result.levelCompleted) {
            playSound('levelComplete')
            // Go to next level or back to dashboard
            const nextLevel = parseInt(levelParam) + 1
            if (nextLevel <= 100) {
              router.push(`/game/${nextLevel}`)
            } else {
              router.push('/dashboard')
            }
          }
        }, 3000)
      } else {
        playSound('incorrect')
        toast.error('Jawaban salah, coba lagi!')
        setAnswer('') // Clear answer for retry

        // Reset streak on wrong answer
        setGameStats(prev => ({
          ...prev,
          currentStreak: 0
        }))
      }

    } catch (error) {
      console.error('Error submitting answer:', error)
      toast.error('Terjadi kesalahan, coba lagi')
    } finally {
      setSubmitting(false)
    }
  }, [answer, submitting, levelParam, playSound, gameStats, checkAndUnlockAchievements, router])

  // Keyboard shortcuts handlers
  const handleHint = useCallback(() => {
    if (correctAnswer && !submitting && !showResult) {
      // Trigger hint system - we'll implement this in the JSX
      const hintEvent = new CustomEvent('triggerHint')
      window.dispatchEvent(hintEvent)
    }
  }, [correctAnswer, submitting, showResult])

  const handleSubmitShortcut = useCallback(() => {
    if (answer.trim() && !submitting && !showResult) {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent
      handleSubmit(syntheticEvent)
    }
  }, [answer, submitting, showResult, handleSubmit])

  const handleNextLevel = useCallback(() => {
    const nextLevel = parseInt(levelParam) + 1
    if (nextLevel <= 100) {
      router.push(`/game/${nextLevel}`)
    }
  }, [levelParam, router])

  const handlePreviousLevel = useCallback(() => {
    const prevLevel = parseInt(levelParam) - 1
    if (prevLevel >= 1) {
      router.push(`/game/${prevLevel}`)
    }
  }, [levelParam, router])

  // Set up keyboard shortcuts
  useGameKeyboardShortcuts({
    onHint: handleHint,
    onSubmit: handleSubmitShortcut,
    onNextLevel: handleNextLevel,
    onPreviousLevel: handlePreviousLevel,
  }, !!levelData && !loadingLevel)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !submitting && answer.trim()) {
      e.preventDefault()
      // Create a synthetic form event
      const form = e.currentTarget.form
      if (form) {
        const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(syntheticEvent)
      }
    }
  }

  if (loading || loadingLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat level...</div>
      </div>
    )
  }

  if (!user || !levelData) {
    return null
  }

  return (
    <div className="min-h-screen p-4 slide-in-up">
      {/* Header */}
      <nav className="glass-card-enhanced p-4 md:p-6 mb-8 floating">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 slide-in-left">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="btn-hover-lift inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <span className="hidden md:inline-block w-px h-6 bg-white/20" />
            <Link href="/dashboard">
              <Button variant="glass" size="sm" className="btn-hover-lift inline-flex items-center">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
          <div className="text-right slide-in-right">
            <h1 className="text-2xl md:text-3xl font-bold rainbow-text font-display">Level {levelData.level}</h1>
            <p className="text-white/70 text-sm">{levelData.progress?.attempts || 0} percobaan</p>
          </div>
        </div>
      </nav>

      {/* Game Content */}
      <div className="max-w-2xl mx-auto">
        <div className="glass-card-enhanced p-8 floating bounce-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold rainbow-text mb-6 font-display animate-pulse">
              Tebak Gambar Diatas
            </h2>

            {/* Image */}
            <div className="mb-8">
              <div className="relative w-full h-64 mx-auto card-hover-3d flex items-center justify-center">
                <Image
                  src={levelData.gambar || '/file.svg'}
                  alt={`Level ${levelData.level} - Tebak Gambar`}
                  width={400}
                  height={256}
                  className="rounded-2xl shadow-2xl object-contain transition-all duration-300 hover:scale-105 max-w-full max-h-full"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement
                    target.src = '/file.svg'
                  }}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSubmit} className="space-y-6 slide-in-up">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Ketik jawaban Anda..."
                className="input-enhanced w-full max-w-md mx-auto px-6 py-4 rounded-2xl text-black bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-center text-xl font-bold backdrop-blur-sm shadow-lg focus-ring"
                autoFocus
                required
                disabled={submitting || showResult}
              />

              <div className="flex justify-center space-x-6">
                <Button
                  type="submit"
                  disabled={submitting || !answer.trim() || showResult}
                  size="lg"
                  variant="gradient"
                  className="btn-hover-lift pulse-glow"
                >
                  {submitting ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Mengecek...
                    </>
                  ) : (
                    'TEBAK'
                  )}
                </Button>

                {levelData.progress?.completed && (
                  <Link href={`/game/${parseInt(levelParam) + 1}`}>
                    <Button variant="success" size="lg" className="btn-hover-lift">
                      <Trophy className="w-5 h-5 mr-2" />
                      Level Berikutnya
                    </Button>
                  </Link>
                )}
              </div>
            </form>

            {/* Hint System */}
            {correctAnswer && (
              <HintSystem
                answer={correctAnswer}
                onHintUsed={(hintsUsed) => {
                  setGameStats(prev => ({
                    ...prev,
                    hintsUsed: hintsUsed
                  }))
                }}
                disabled={submitting || showResult}
                maxHints={3}
              />
            )}

            {/* Keyboard Shortcuts Help */}
            <div className="mt-6 text-center space-x-6 slide-in-up">
              <span className="inline-flex items-center glass-card-enhanced px-3 py-2 rounded-lg hover:scale-105 transition-transform duration-200">
                <Keyboard className="w-4 h-4 mr-2 text-purple-400" />
                <kbd className="px-2 py-1 bg-purple-500/20 rounded text-sm font-semibold text-purple-300">Space</kbd>
                <span className="ml-2 text-white/80 text-sm">Hint</span>
              </span>
              <span className="inline-flex items-center glass-card-enhanced px-3 py-2 rounded-lg hover:scale-105 transition-transform duration-200">
                <kbd className="px-2 py-1 bg-green-500/20 rounded text-sm font-semibold text-green-300">Enter</kbd>
                <span className="ml-2 text-white/80 text-sm">Submit</span>
              </span>
              <span className="inline-flex items-center glass-card-enhanced px-3 py-2 rounded-lg hover:scale-105 transition-transform duration-200">
                <kbd className="px-2 py-1 bg-blue-500/20 rounded text-sm font-semibold text-blue-300">←→</kbd>
                <span className="ml-2 text-white/80 text-sm">Navigate</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && lastResult && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card-enhanced p-8 max-w-md w-full text-center rounded-2xl shadow-2xl border-2 border-white/20 bounce-in">
            <div className="mb-6">
              {lastResult.correct ? (
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg pulse-glow floating">
                  <CheckCircle className="w-10 h-10 text-white animate-bounce" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-4 rainbow-text">
              {lastResult.correct ? 'Selamat! 🎉' : 'Belum Beruntung 😅'}
            </h3>

            {lastResult.correct && lastResult.answer && (
              <div className="mb-6 text-left bg-white/5 rounded-xl p-4 slide-in-up">
                <p className="font-bold text-purple-300 mb-2">Makna:</p>
                <p className="text-white/90 mb-4 leading-relaxed">{lastResult.answer.makna}</p>
                <p className="font-bold text-purple-300 mb-2">Peribahasa:</p>
                <p className="text-white/90 font-medium italic">&ldquo;{lastResult.answer.peribahasa}&rdquo;</p>
              </div>
            )}

            <div className="bg-white/10 rounded-lg p-3 mb-6 slide-in-up">
              <p className="text-white/80">
                <span className="font-bold text-purple-300">Percobaan:</span> {lastResult.attempts}
              </p>
            </div>

            <Button
              onClick={() => setShowResult(false)}
              variant={lastResult.correct ? "success" : "warning"}
              size="lg"
              className="w-full btn-hover-lift"
            >
              {lastResult.correct ? 'Lanjutkan' : 'Coba Lagi'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}