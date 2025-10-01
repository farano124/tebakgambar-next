'use client'

import { useAuth } from '@/lib/auth'
import { useAchievements } from '@/lib/achievements'
import { AchievementCard } from '@/components/ui/AchievementCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trophy, Star, Filter } from 'lucide-react'

export default function AchievementsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const {
    achievements,
    unlockedAchievements,
    getAchievementProgress,
    getTotalXP,
    loading
  } = useAchievements()

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const filteredAchievements = achievements.filter(achievement => {
    const isUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id)

    if (filter === 'unlocked' && !isUnlocked) return false
    if (filter === 'locked' && isUnlocked) return false
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) return false

    return true
  })

  const categories = [
    { value: 'all', label: 'Semua', icon: '🏆' },
    { value: 'progression', label: 'Progress', icon: '📈' },
    { value: 'accuracy', label: 'Akurasi', icon: '🎯' },
    { value: 'speed', label: 'Kecepatan', icon: '⚡' },
    { value: 'persistence', label: 'Ketekunan', icon: '🔥' },
    { value: 'social', label: 'Sosial', icon: '👥' },
    { value: 'special', label: 'Spesial', icon: '💎' }
  ]

  const totalAchievements = achievements.length
  const unlockedCount = unlockedAchievements.length
  const completionPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat achievements...</div>
      </div>
    )
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
              <h1 className="text-xl font-bold text-white flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                Achievements
              </h1>
              <p className="text-white/60 text-sm">
                {unlockedCount} dari {totalAchievements} achievements • {completionPercentage.toFixed(1)}% selesai
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">{getTotalXP()} XP</span>
          </div>
        </div>
      </nav>

      {/* Stats Overview */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{unlockedCount}</div>
              <div className="text-sm text-white/60">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{totalAchievements - unlockedCount}</div>
              <div className="text-sm text-white/60">Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{completionPercentage.toFixed(1)}%</div>
              <div className="text-sm text-white/60">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{getTotalXP()}</div>
              <div className="text-sm text-white/60">Total XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/60" />
              <span className="text-white font-medium">Filter:</span>
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'Semua' },
                { value: 'unlocked', label: 'Unlocked' },
                { value: 'locked', label: 'Locked' }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(option.value as 'all' | 'unlocked' | 'locked')}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2">
              {categories.map(category => (
                <Button
                  key={category.value}
                  variant={categoryFilter === category.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(category.value)}
                  className="text-xs"
                >
                  {category.icon} {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map(achievement => {
            const isUnlocked = unlockedAchievements.some(ua => ua.id === achievement.id)
            const progress = getAchievementProgress(achievement)

            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isUnlocked}
                progress={!isUnlocked ? progress : undefined}
              />
            )
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/60 mb-2">
              Tidak ada achievements ditemukan
            </h3>
            <p className="text-white/40">
              Coba ubah filter atau lanjutkan bermain untuk unlock achievements!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}