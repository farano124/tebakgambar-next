'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSound } from './sound'
import toast from 'react-hot-toast'

export type AchievementCategory =
  | 'progression'
  | 'accuracy'
  | 'speed'
  | 'persistence'
  | 'social'
  | 'special'

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  rarity: AchievementRarity
  criteria: AchievementCriteria
  reward: AchievementReward
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

export interface AchievementCriteria {
  type: 'level_reached' | 'correct_answers' | 'streak' | 'hints_used' | 'time_played' | 'games_played' | 'perfect_level'
  value: number
  comparison?: 'gte' | 'lte' | 'eq'
}

export interface AchievementReward {
  xp?: number
  title?: string
  badge?: string
}

export interface UserAchievement {
  achievementId: string
  unlockedAt: Date
  progress: number
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Progression Achievements
  {
    id: 'first_steps',
    title: 'Langkah Pertama',
    description: 'Menyelesaikan level pertama',
    icon: '🎯',
    category: 'progression',
    rarity: 'common',
    criteria: { type: 'level_reached', value: 1 },
    reward: { xp: 10, title: 'Pemula' }
  },
  {
    id: 'getting_started',
    title: 'Memulai Perjalanan',
    description: 'Menyelesaikan 10 level pertama',
    icon: '🚀',
    category: 'progression',
    rarity: 'common',
    criteria: { type: 'level_reached', value: 10 },
    reward: { xp: 50, title: 'Petualang' }
  },
  {
    id: 'halfway_there',
    title: 'Setengah Jalan',
    description: 'Menyelesaikan 50 level',
    icon: '🏔️',
    category: 'progression',
    rarity: 'rare',
    criteria: { type: 'level_reached', value: 50 },
    reward: { xp: 200, title: 'Pendaki Gunung' }
  },
  {
    id: 'master_player',
    title: 'Master Player',
    description: 'Menyelesaikan semua 100 level',
    icon: '👑',
    category: 'progression',
    rarity: 'legendary',
    criteria: { type: 'level_reached', value: 100 },
    reward: { xp: 1000, title: 'Master Tebak Gambar' }
  },

  // Accuracy Achievements
  {
    id: 'sharp_eye',
    title: 'Mata Tajam',
    description: 'Jawaban benar 50 kali tanpa kesalahan',
    icon: '👁️',
    category: 'accuracy',
    rarity: 'rare',
    criteria: { type: 'correct_answers', value: 50 },
    reward: { xp: 150, badge: 'sharp_eye' }
  },
  {
    id: 'perfect_level',
    title: 'Sempurna!',
    description: 'Menyelesaikan level tanpa menggunakan hint',
    icon: '💎',
    category: 'accuracy',
    rarity: 'epic',
    criteria: { type: 'perfect_level', value: 1 },
    reward: { xp: 100, badge: 'perfect' }
  },
  {
    id: 'flawless_victory',
    title: 'Kemenangan Sempurna',
    description: 'Menyelesaikan 10 level tanpa hint',
    icon: '🌟',
    category: 'accuracy',
    rarity: 'legendary',
    criteria: { type: 'perfect_level', value: 10 },
    reward: { xp: 500, title: 'Sempurna' }
  },

  // Persistence Achievements
  {
    id: 'persistent',
    title: 'Gigih',
    description: 'Bermain game selama 1 jam',
    icon: '⚡',
    category: 'persistence',
    rarity: 'common',
    criteria: { type: 'time_played', value: 3600 }, // 1 hour in seconds
    reward: { xp: 75, badge: 'persistent' }
  },
  {
    id: 'dedicated',
    title: 'Berdedikasi',
    description: 'Bermain game selama 10 jam',
    icon: '🔥',
    category: 'persistence',
    rarity: 'rare',
    criteria: { type: 'time_played', value: 36000 }, // 10 hours
    reward: { xp: 300, title: 'Dedikasi' }
  },

  // Special Achievements
  {
    id: 'speed_demon',
    title: 'Setan Kecepatan',
    description: 'Menyelesaikan level dalam waktu kurang dari 10 detik',
    icon: '💨',
    category: 'speed',
    rarity: 'epic',
    criteria: { type: 'time_played', value: 10, comparison: 'lte' },
    reward: { xp: 200, badge: 'speed' }
  },
  {
    id: 'minimalist',
    title: 'Minimalis',
    description: 'Menyelesaikan level hanya dengan 1 huruf hint',
    icon: '🎯',
    category: 'special',
    rarity: 'rare',
    criteria: { type: 'hints_used', value: 1, comparison: 'eq' },
    reward: { xp: 100, badge: 'minimalist' }
  }
]

// Achievement tracking hook
export function useAchievements() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const { playSound } = useSound()

  // Load user achievements
  useEffect(() => {
    loadUserAchievements()
  }, [])

  const loadUserAchievements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/achievements')
      if (response.ok) {
        const achievements = await response.json()
        setUserAchievements(achievements)

        // Find unlocked achievements
        const unlocked = ACHIEVEMENTS.filter(achievement =>
          achievements.some((ua: UserAchievement) => ua.achievementId === achievement.id)
        )
        setUnlockedAchievements(unlocked)
      }
    } catch (error) {
      console.error('Error loading achievements:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const checkAndUnlockAchievements = useCallback(async (gameStats: GameStats) => {
    const newlyUnlocked: Achievement[] = []

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (unlockedAchievements.some(ua => ua.id === achievement.id)) {
        continue
      }

      // Check if criteria is met
      if (isCriteriaMet(achievement.criteria, gameStats)) {
        try {
          // Unlock achievement
          const response = await fetch('/api/user/achievements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              achievementId: achievement.id,
              progress: gameStats
            }),
          })

          if (response.ok) {
            const unlockedAchievement = { ...achievement, unlockedAt: new Date() }
            newlyUnlocked.push(unlockedAchievement)

            // Play achievement sound
            playSound('levelUp')

            // Show achievement toast
            toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, {
              duration: 5000,
              icon: achievement.icon,
            })
          }
        } catch (error) {
          console.error('Error unlocking achievement:', error)
        }
      }
    }

    // Update local state
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked])
      await loadUserAchievements() // Refresh from server
    }

    return newlyUnlocked
  }, [unlockedAchievements, playSound, loadUserAchievements])

  const getAchievementProgress = useCallback((achievement: Achievement): { current: number, max: number, percentage: number } => {
    // This would be more complex in a real implementation
    // For now, return dummy progress
    const isUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id)
    return {
      current: isUnlocked ? achievement.criteria.value : 0,
      max: achievement.criteria.value,
      percentage: isUnlocked ? 100 : 0
    }
  }, [unlockedAchievements])

  const getTotalXP = useCallback(() => {
    return unlockedAchievements.reduce((total, achievement) => {
      return total + (achievement.reward.xp || 0)
    }, 0)
  }, [unlockedAchievements])

  return {
    achievements: ACHIEVEMENTS,
    unlockedAchievements,
    userAchievements,
    loading,
    checkAndUnlockAchievements,
    getAchievementProgress,
    getTotalXP,
    refreshAchievements: loadUserAchievements
  }
}

// Helper function to check if achievement criteria is met
function isCriteriaMet(criteria: AchievementCriteria, stats: GameStats): boolean {
  const comparison = criteria.comparison || 'gte'

  switch (criteria.type) {
    case 'level_reached':
      return compareValues(stats.currentLevel, criteria.value, comparison)
    case 'correct_answers':
      return compareValues(stats.totalCorrect, criteria.value, comparison)
    case 'streak':
      return compareValues(stats.currentStreak, criteria.value, comparison)
    case 'hints_used':
      return compareValues(stats.hintsUsed, criteria.value, comparison)
    case 'time_played':
      return compareValues(stats.totalTimePlayed, criteria.value, comparison)
    case 'games_played':
      return compareValues(stats.gamesPlayed, criteria.value, comparison)
    case 'perfect_level':
      return compareValues(stats.perfectLevels, criteria.value, comparison)
    default:
      return false
  }
}

function compareValues(current: number, target: number, comparison: string): boolean {
  switch (comparison) {
    case 'gte':
      return current >= target
    case 'lte':
      return current <= target
    case 'eq':
      return current === target
    default:
      return current >= target
  }
}

// Game stats interface
export interface GameStats {
  currentLevel: number
  totalCorrect: number
  currentStreak: number
  hintsUsed: number
  totalTimePlayed: number
  gamesPlayed: number
  perfectLevels: number
}

// Utility functions
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(achievement => achievement.id === id)
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category)
}

export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.rarity === rarity)
}