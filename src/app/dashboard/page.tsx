'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SoundToggle } from '@/components/ui/SoundToggle'
import Link from 'next/link'
import { LogOut, User, Trophy, Play, CheckCircle, Shield, Award } from 'lucide-react'

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
            console.error('Response status:', response.status)
            console.error('Response statusText:', response.statusText)
            console.error('Response headers:', Object.fromEntries(response.headers.entries()))
            const responseText = await response.text()
            console.error('Response body text:', responseText)
            let errorData
            try {
              errorData = JSON.parse(responseText)
            } catch {
              errorData = { error: 'Invalid JSON response' }
            }
            setProfileError(errorData.error || 'Failed to load profile')
            console.error('Parsed errorData:', errorData)
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
    <div className="min-h-screen p-4 slide-in-up">
      {/* Header */}
      <nav className="glass-card-enhanced p-6 mb-8 floating">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 slide-in-left">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center pulse-glow">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold rainbow-text font-display">
                {userProfile.nama}
              </h1>
              <p className="text-white/80">
                Level {currentLevel} • {userProfile.salah} kesalahan total
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 slide-in-right">
            <SoundToggle />
            <Button onClick={handleSignOut} variant="danger" size="sm" className="btn-hover-lift">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Game Card */}
        <div className="glass-card-enhanced p-6 group card-hover-3d bounce-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold rainbow-text font-display">Main Game</h2>
          </div>
          <p className="text-white/80 mb-6">
            Lanjutkan permainan tebak gambar Anda
          </p>
          <Link href="/game">
            <Button variant="gradient" className="w-full btn-hover-lift">
              Mulai Bermain
            </Button>
          </Link>
        </div>

        {/* Rankings Card */}
        <div className="glass-card-enhanced p-6 group card-hover-3d bounce-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold rainbow-text font-display">Peringkat</h2>
          </div>
          <p className="text-white/80 mb-6">
            Lihat peringkat pemain lainnya
          </p>
          <Link href="/rankings">
            <Button variant="secondary" className="w-full btn-hover-lift">
              Lihat Peringkat
            </Button>
          </Link>
        </div>

        {/* Achievements Card */}
        <div className="glass-card-enhanced p-6 group card-hover-3d bounce-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold rainbow-text font-display">Achievements</h2>
          </div>
          <p className="text-white/80 mb-6">
            Lihat pencapaian dan badge Anda
          </p>
          <Link href="/achievements">
            <Button variant="warning" className="w-full btn-hover-lift">
              Lihat Achievements
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="glass-card-enhanced p-6 group card-hover-3d bounce-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold rainbow-text font-display">Profil</h2>
          </div>
          <p className="text-white/80 mb-6">
            Kelola profil dan pengaturan akun
          </p>
          <Link href="/profile">
            <Button variant="info" className="w-full btn-hover-lift">
              Lihat Profil
            </Button>
          </Link>
        </div>

        {/* Admin Card - Only shown to admins */}
        {isAdmin && (
          <div className="glass-card-enhanced p-6 group card-hover-3d bounce-in border border-yellow-400/30" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 pulse-glow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold rainbow-text font-display">Admin Panel</h2>
            </div>
            <p className="text-white/80 mb-6">
              Kelola pengguna dan level permainan
            </p>
            <Link href="/admin">
              <Button variant="warning" className="w-full btn-hover-lift">
                Panel Admin
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Level Selector */}
      <div className="max-w-4xl mx-auto mt-8 slide-in-up">
        <div className="glass-card-enhanced p-6 mb-8 floating">
          <h3 className="text-2xl font-bold rainbow-text mb-6 font-display">Pilih Level untuk Bermain</h3>
          <div className="mb-4">
            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-700 shadow-lg shimmer"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-white/70 text-sm mt-2 text-center">
              <span className="font-bold text-white">{currentLevel}</span> dari <span className="font-bold rainbow-text">{totalLevels}</span> level • <span className="font-bold text-green-400">{progressPercentage.toFixed(1)}%</span> selesai
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3">
            {Array.from({ length: totalLevels }, (_, i) => {
              const levelNumber = i + 1
              const canPlay = levelNumber <= currentLevel
              const isCurrent = levelNumber === currentLevel
              const isCompleted = levelNumber < currentLevel
              return (
                <button
                  key={levelNumber}
                  onClick={() => canPlay && router.push(`/game/${levelNumber}`)}
                  disabled={!canPlay}
                  className={[
                    'group relative aspect-square rounded-xl flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-lg btn-hover-lift overflow-hidden',
                    canPlay
                      ? (isCurrent
                        ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 text-white ring-2 ring-emerald-300/60 pulse-glow hover:scale-105'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-105')
                      : 'bg-gray-600/50 text-white/60 cursor-not-allowed border border-gray-500/30 backdrop-blur-sm',
                  ].join(' ')}
                  title={
                    canPlay
                      ? (isCurrent ? `Main Level ${levelNumber} (terbaru)` : `Main Level ${levelNumber}`)
                      : `Level ${levelNumber} belum terbuka`
                  }
                  aria-label={`Level ${levelNumber} ${canPlay ? (isCurrent ? 'level terbaru' : 'tersedia') : 'terkunci'}`}
                >
                  {/* Shine effect */}
                  {canPlay && (
                    <span className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                      <span className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rotate-45 -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-out" />
                    </span>
                  )}

                  {/* Corner badges */}
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500 text-white shadow-md uppercase tracking-wider">
                      Next
                    </span>
                  )}
                  {isCompleted && (
                    <span className="absolute top-1 left-1 text-emerald-200/90">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  )}

                  <span className={`text-lg ${!canPlay ? 'opacity-70' : 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'}`}>
                    {levelNumber}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gradient-to-br from-emerald-400 to-teal-600 inline-block"></span>
              <span>Level terbaru</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-600 inline-block"></span>
              <span>Bisa dipilih</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-600 inline-block"></span>
              <span>Terkunci</span>
            </div>
          </div>
        </div>
      </div>

          </div>
  )
}