'use client'

import { useState, useCallback, memo, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { useSound } from '@/lib/sound'
import { Lightbulb, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface HintSystemProps {
  answer: string
  onHintUsed?: (hintsUsed: number) => void
  disabled?: boolean
  hintCount?: number
  maxHints?: number
}

export const HintSystem = memo(function HintSystem({
  answer,
  onHintUsed,
  disabled = false,
  hintCount = 0,
  maxHints = 3
}: HintSystemProps) {
  const { playSound } = useSound()
  const [revealedLetters, setRevealedLetters] = useState<Set<number>>(new Set())
  const [usedHints, setUsedHints] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const getHintCost = useCallback((hintNumber: number): number => {
    // Progressive hint cost: 1st hint = 1 letter, 2nd = 2 letters, etc.
    return hintNumber
  }, [])

  const canUseHint = useCallback(() => {
    return !disabled && usedHints < maxHints && revealedLetters.size < answer.length
  }, [disabled, usedHints, maxHints, revealedLetters.size, answer.length])

  const revealHint = useCallback(() => {
    if (!canUseHint()) return

    const hintCost = getHintCost(usedHints + 1)
    const availablePositions = Array.from({ length: answer.length }, (_, i) => i)
      .filter(i => !revealedLetters.has(i))

    if (availablePositions.length === 0) return

    // Reveal letters based on hint cost
    const positionsToReveal = availablePositions.slice(0, hintCost)
    const newRevealed = new Set(revealedLetters)

    positionsToReveal.forEach(pos => newRevealed.add(pos))

    setRevealedLetters(newRevealed)
    setUsedHints(prev => prev + 1)
    setShowHint(true)

    playSound('notification')
    onHintUsed?.(usedHints)

    // Auto-hide hint after 3 seconds
    setTimeout(() => setShowHint(false), 3000)

    toast.success(`Hint digunakan! ${hintCost} huruf terungkap`, {
      icon: '💡'
    })
  }, [canUseHint, getHintCost, usedHints, revealedLetters, answer.length, playSound, onHintUsed])

  const toggleHintVisibility = useCallback(() => {
    setShowHint(prev => !prev)
  }, [])

  const renderHintDisplay = () => {
    if (!showHint) return null

    return (
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint ({usedHints}/{maxHints} digunakan)
          </h4>
          <Button
            onClick={toggleHintVisibility}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {showHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1">
          {answer.split('').map((letter, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded border-2 flex items-center justify-center text-sm font-bold transition-all ${
                revealedLetters.has(index)
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
                  : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
              }`}
            >
              {revealedLetters.has(index) ? letter.toUpperCase() : '?'}
            </div>
          ))}
        </div>

        <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
          Huruf yang terungkap: {Array.from(revealedLetters).map(i => answer[i]).join(', ')}
        </p>
      </div>
    )
  }

  // Listen for keyboard shortcut events
  useEffect(() => {
    const handleTriggerHint = () => {
      if (canUseHint()) {
        revealHint()
      }
    }

    window.addEventListener('triggerHint', handleTriggerHint)
    return () => window.removeEventListener('triggerHint', handleTriggerHint)
  }, [canUseHint, revealHint])

  return (
    <div className="hint-system">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button
            onClick={revealHint}
            disabled={!canUseHint()}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint ({maxHints - usedHints} tersisa)
          </Button>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            Tekan <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Space</kbd> untuk hint
          </span>
        </div>

        {usedHints > 0 && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Hints digunakan: {usedHints}/{maxHints}
          </div>
        )}
      </div>

      {renderHintDisplay()}
    </div>
  )
})