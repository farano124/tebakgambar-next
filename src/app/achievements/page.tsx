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
    <div className="min-h-screen p-4 slide-in-up">
      {/* Header */}
      <nav className="glass-card-enhanced p-6 mb-8 floating">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 slide-in-left">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="btn-hover-lift">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold rainbow-text flex items-center font-display">
                <Trophy className="w-8 h-8 mr-3 text-yellow-400 pulse-glow" />
                Achievements
              </h1>
              <p className="text-white/70 text-sm">
                {unlockedCount} dari {totalAchievements} achievements • {completionPercentage.toFixed(1)}% selesai
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 slide-in-right bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
            <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className="text-white font-bold text-lg">{getTotalXP()} XP</span>
          </div>
        </div>
      </nav>

      {/* Stats Overview */}
      <div className="max-w-6xl mx-auto mb-8 slide-in-up">
        <div className="glass-card-enhanced p-6 floating">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center card-hover-3d bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 pulse-glow">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-400">{unlockedCount}</div>
              <div className="text-sm text-white/70 font-medium">Unlocked</div>
            </div>
            <div className="text-center card-hover-3d bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3 pulse-glow">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-red-400">{totalAchievements - unlockedCount}</div>
              <div className="text-sm text-white/70 font-medium">Locked</div>
            </div>
            <div className="text-center card-hover-3d bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 pulse-glow">
                <div className="text-2xl font-bold text-white">✓</div>
              </div>
              <div className="text-3xl font-bold text-green-400">{completionPercentage.toFixed(1)}%</div>
              <div className="text-sm text-white/70 font-medium">Complete</div>
            </div>
            <div className="text-center card-hover-3d bounce-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 pulse-glow">
                <div className="text-xl font-bold text-white">XP</div>
              </div>
              <div className="text-3xl font-bold text-yellow-400">{getTotalXP()}</div>
              <div className="text-sm text-white/70 font-medium">Total XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-6 slide-in-up">
        <div className="glass-card-enhanced p-6 floating">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-3 slide-in-left">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Filter Achievements:</span>
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2 slide-in-right">
              {[
                { value: 'all', label: 'Semua' },
                { value: 'unlocked', label: 'Unlocked' },
                { value: 'locked', label: 'Locked' }
              ].map((option, index) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? 'gradient' : 'glass'}
                  size="sm"
                  onClick={() => setFilter(option.value as 'all' | 'unlocked' | 'locked')}
                  className="btn-hover-lift bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 slide-in-up">
              {categories.map((category, index) => (
                <Button
                  key={category.value}
                  variant={categoryFilter === category.value ? 'gradient' : 'glass'}
                  size="sm"
                  onClick={() => setCategoryFilter(category.value)}
                  className="btn-hover-lift bounce-in"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
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
          <div className="glass-card-enhanced p-12 text-center slide-in-up">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 floating">
              <Trophy className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white/70 mb-3 rainbow-text">
              Tidak ada achievements ditemukan
            </h3>
            <p className="text-white/50 mb-6 text-lg">
              Coba ubah filter atau lanjutkan bermain untuk unlock achievements!
            </p>
            <Link href="/dashboard">
              <Button variant="gradient" className="btn-hover-lift">
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}