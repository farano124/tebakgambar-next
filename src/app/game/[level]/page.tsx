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
        throw new Error('Failed to fetch level data')
      }

      const data = await response.json()
      setLevelData(data)
      // Store the correct answer for hint system
      if (data.peribahasa) {
        setCorrectAnswer(data.peribahasa.toUpperCase())
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
        throw new Error('Failed to check answer')
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
          perfectLevels: gameStats.perfectLevels + (gameStats.hintsUsed === 0 ? 1 : 0)
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
    <div className="min-h-screen p-4">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white font-display">
                Level {levelData.level}
              </h1>
              <p className="text-body-xs text-white/60">
                {levelData.progress?.attempts || 0} percobaan
              </p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Game Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 font-display">
              Tebak Gambar Diatas
            </h2>

            {/* Image */}
            <div className="mb-8">
              <div className="relative max-w-full max-h-64 mx-auto">
                <Image
                  src={`/api/images/${levelData.level}.jpg`}
                  alt={`Level ${levelData.level} - Tebak Gambar`}
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg object-contain"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0Rpv6pX6BU6M6l6pWzK2XvfFp3ZfbrD4"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-image.jpg'
                  }}
                />
              </div>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Ketik jawaban Anda..."
                className="w-full max-w-md mx-auto px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all text-center text-lg font-semibold"
                autoFocus
                required
                disabled={submitting || showResult}
              />

              <div className="flex justify-center space-x-4">
                <Button
                  type="submit"
                  disabled={submitting || !answer.trim() || showResult}
                  size="lg"
                >
                  {submitting ? 'Mengecek...' : 'TEBAK'}
                </Button>

                {levelData.progress?.completed && (
                  <Link href={`/game/${parseInt(levelParam) + 1}`}>
                    <Button variant="outline" size="lg">
                      <Trophy className="w-4 h-4 mr-2" />
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
            <div className="mt-4 text-center text-xs text-white/60 space-x-4">
              <span className="inline-flex items-center">
                <Keyboard className="w-3 h-3 mr-1" />
                <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Space</kbd> Hint
              </span>
              <span className="inline-flex items-center">
                <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> Submit
              </span>
              <span className="inline-flex items-center">
                <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">←→</kbd> Navigate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && lastResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="mb-4">
              {lastResult.correct ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              )}
            </div>

            <h3 className="text-xl font-bold mb-2">
              {lastResult.correct ? 'Selamat! 🎉' : 'Belum Beruntung 😅'}
            </h3>

            {lastResult.correct && lastResult.answer && (
              <div className="mb-4 text-left">
                <p className="font-semibold">Makna:</p>
                <p className="text-gray-600 mb-2">{lastResult.answer.makna}</p>
                <p className="font-semibold">Peribahasa:</p>
                <p className="text-gray-600">{lastResult.answer.peribahasa}</p>
              </div>
            )}

            <p className="text-gray-600 mb-4">
              Percobaan: {lastResult.attempts}
            </p>

            <Button
              onClick={() => setShowResult(false)}
              className="w-full"
            >
              {lastResult.correct ? 'Lanjutkan' : 'Coba Lagi'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}