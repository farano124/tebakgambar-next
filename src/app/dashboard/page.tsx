'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SoundToggle } from '@/components/ui/SoundToggle'
import Link from 'next/link'
import { LogOut, User, Trophy, Play, CheckCircle, Lock, Shield, Award } from 'lucide-react'

interface UserProfile {
  id: string
  nama: string
  username: string
  level: number
  salah: number
  email: string
  created_at: string
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Fetch user profile from our database
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          setProfileError(null)
          const response = await fetch(`/api/user/profile`)
          if (response.ok) {
            const data = await response.json()
            setUserProfile(data)
            setIsAdmin(data.akses === 0) // 0 = admin
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            setProfileError(errorData.error || 'Failed to load profile')
            console.error('Error fetching user profile:', errorData)
          }
        } catch (error) {
          setProfileError('Network error: Unable to connect to server')
          console.error('Error fetching user profile:', error)
        } finally {
          setLoadingProfile(false)
        }
      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat dashboard...</div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h2>
          <p className="text-white/80 mb-6">{profileError}</p>
          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              Coba Lagi
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Keluar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return null // Will redirect to login
  }

  const currentLevel = userProfile.level
  const totalLevels = 100
  const progressPercentage = (currentLevel / totalLevels) * 100

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <nav className="glass-card p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text font-display">
                {userProfile.nama}
              </h1>
              <p className="text-white/80">
                Level {currentLevel} • {userProfile.salah} kesalahan total
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SoundToggle />
            <ThemeToggle />
            <Button onClick={handleSignOut} variant="danger" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Game Card */}
        <div className="glass-card p-6 group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text font-display">Main Game</h2>
          </div>
          <p className="text-white/80 mb-6">
            Lanjutkan permainan tebak gambar Anda
          </p>
          <Link href="/game">
            <Button variant="gradient" className="w-full">
              Mulai Bermain
            </Button>
          </Link>
        </div>

        {/* Rankings Card */}
        <div className="glass-card p-6 group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text font-display">Peringkat</h2>
          </div>
          <p className="text-white/80 mb-6">
            Lihat peringkat pemain lainnya
          </p>
          <Link href="/rankings">
            <Button variant="secondary" className="w-full">
              Lihat Peringkat
            </Button>
          </Link>
        </div>

        {/* Achievements Card */}
        <div className="glass-card p-6 group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text font-display">Achievements</h2>
          </div>
          <p className="text-white/80 mb-6">
            Lihat pencapaian dan badge Anda
          </p>
          <Link href="/achievements">
            <Button variant="warning" className="w-full">
              Lihat Achievements
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6 group">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text font-display">Profil</h2>
          </div>
          <p className="text-white/80 mb-6">
            Kelola profil dan pengaturan akun
          </p>
          <Link href="/profile">
            <Button variant="info" className="w-full">
              Lihat Profil
            </Button>
          </Link>
        </div>

        {/* Admin Card - Only shown to admins */}
        {isAdmin && (
          <div className="glass-card p-6 group border border-yellow-400/30">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold gradient-text font-display">Admin Panel</h2>
            </div>
            <p className="text-white/80 mb-6">
              Kelola pengguna dan level permainan
            </p>
            <Link href="/admin">
              <Button variant="warning" className="w-full">
                Panel Admin
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Level Selector */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="glass-card p-6 mb-8">
          <h3 className="text-2xl font-bold gradient-text mb-6 font-display">Pilih Level untuk Bermain</h3>
          <div className="mb-6">
            <select
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm"
              onChange={(e) => {
                const level = parseInt(e.target.value)
                if (level > 0) {
                  router.push(`/game/${level}`)
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Pilih level...</option>
              {Array.from({ length: currentLevel }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Level {i + 1}
                </option>
              ))}
            </select>
          </div>
          <p className="text-white/70 text-sm">
            Anda dapat memainkan level 1 sampai level {currentLevel}
          </p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6">
          <h3 className="text-2xl font-bold gradient-text mb-6 font-display">Progress Level</h3>
          <div className="mb-6">
            <div className="w-full bg-white/10 rounded-full h-4 backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-700 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-white/80 text-center mt-4 text-lg">
              <span className="font-bold text-white">{currentLevel}</span> dari <span className="font-bold gradient-text">{totalLevels}</span> level • <span className="font-bold text-green-400">{progressPercentage.toFixed(1)}%</span> selesai
            </p>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {Array.from({ length: Math.min(currentLevel + 5, 50) }, (_, i) => {
              const levelNumber = i + 1
              const isCompleted = levelNumber <= currentLevel
              const isLocked = levelNumber > currentLevel

              return (
                <div
                  key={levelNumber}
                  className={`aspect-square rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-all hover:scale-110 shadow-lg hover:shadow-xl ${
                    isLocked
                      ? 'bg-gray-600/50 cursor-not-allowed backdrop-blur-sm border border-gray-500/30'
                      : isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-green-400/30'
                      : 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-yellow-400/30'
                  }`}
                  onClick={() => !isLocked && router.push(`/game/${levelNumber}`)}
                  title={
                    isLocked
                      ? `Level ${levelNumber} belum terbuka`
                      : `Main Level ${levelNumber}`
                  }
                >
                  {isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-lg">{levelNumber}</span>
                  )}
                </div>
              )
            })}
          </div>

          {currentLevel > 50 && (
            <p className="text-white/60 mt-4 text-center text-sm">
              +{currentLevel - 50} level lagi tersedia...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}