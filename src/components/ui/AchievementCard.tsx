'use client'

import { memo } from 'react'
import { Achievement } from '@/lib/achievements'
import { Lock, Star, Trophy, CheckCircle } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: {
    current: number
    max: number
    percentage: number
  }
  onClick?: () => void
}

export const AchievementCard = memo(function AchievementCard({
  achievement,
  isUnlocked,
  progress,
  onClick
}: AchievementCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800/50'
      case 'rare':
        return 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
      case 'epic':
        return 'border-purple-300 bg-purple-50 dark:bg-purple-900/20'
      case 'legendary':
        return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800/50'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'rare':
        return <Star className="w-3 h-3 text-blue-500" />
      case 'epic':
        return <Trophy className="w-3 h-3 text-purple-500" />
      case 'legendary':
        return <Trophy className="w-3 h-3 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
        isUnlocked
          ? `${getRarityColor(achievement.rarity)} shadow-lg`
          : 'border-gray-200 bg-gray-100 dark:bg-gray-800/30 opacity-60'
      }`}
      onClick={onClick}
    >
      {/* Achievement Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
          {achievement.icon}
        </div>

        <div className="flex items-center space-x-1">
          {getRarityIcon(achievement.rarity)}
          {isUnlocked ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Lock className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Achievement Title */}
      <h3 className={`font-bold text-sm mb-1 ${
        isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
      }`}>
        {achievement.title}
      </h3>

      {/* Achievement Description */}
      <p className={`text-xs mb-3 ${
        isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
      }`}>
        {achievement.description}
      </p>

      {/* Progress Bar (if not unlocked) */}
      {progress && !isUnlocked && (
        <div className="mb-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {progress.current} / {progress.max}
          </p>
        </div>
      )}

      {/* Reward Info */}
      {achievement.reward.xp && achievement.reward.xp > 0 && (
        <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
          <Star className="w-3 h-3 mr-1" />
          +{achievement.reward.xp} XP
        </div>
      )}

      {/* Rarity Badge */}
      <div className="absolute top-2 right-2">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          isUnlocked
            ? achievement.rarity === 'legendary'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : achievement.rarity === 'epic'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : achievement.rarity === 'rare'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          {achievement.rarity.toUpperCase()}
        </span>
      </div>
    </div>
  )
})