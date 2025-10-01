'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Trophy, Medal, Award, Crown, Star, ArrowLeft } from 'lucide-react'

interface RankingUser {
  rank: number
  id: string
  nama: string
  username: string
  level: number
  salah: number
  created_at: string
}

export default function RankingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [rankings, setRankings] = useState<RankingUser[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [loadingRankings, setLoadingRankings] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    if (user) {
      fetchRankings()
    }
  }, [user, loading, router])

  const fetchRankings = async () => {
    try {
      setLoadingRankings(true)
      setError(null)
      const response = await fetch('/api/rankings')

      if (response.ok) {
        const data = await response.json()
        setRankings(data.rankings || [])
        setCurrentUserRank(data.currentUserRank)
        setTotalPlayers(data.totalPlayers || 0)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setError(errorData.error || 'Failed to load rankings')
      }
    } catch (error) {
      setError('Network error: Unable to connect to server')
      console.error('Error fetching rankings:', error)
    } finally {
      setLoadingRankings(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <Star className="w-5 h-5 text-purple-400" />
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500'
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700'
    if (rank <= 10) return 'bg-gradient-to-r from-purple-400 to-purple-600'
    return 'bg-gradient-to-r from-blue-400 to-blue-600'
  }

  if (loading || loadingRankings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat peringkat...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
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
              <h1 className="text-4xl font-bold rainbow-text font-display flex items-center">
                <Trophy className="w-10 h-10 mr-3 pulse-glow" />
                Peringkat Pemain
              </h1>
              <p className="text-white/70">Lihat posisi Anda di antara pemain lain</p>
            </div>
          </div>
          <div className="slide-in-right">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center pulse-glow">
              <Medal className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Current User Rank Highlight */}
      {currentUserRank && (
        <div className="max-w-4xl mx-auto mb-8 slide-in-up">
          <div className="glass-card-enhanced p-6 border-2 border-purple-400/50 floating bounce-in">
            <div className="text-center">
              <h3 className="text-xl font-bold rainbow-text mb-4">Peringkat Anda</h3>
              <div className="flex items-center justify-center space-x-6">
                <div className={`w-20 h-20 rounded-full ${getRankBadge(currentUserRank)} flex items-center justify-center shadow-2xl pulse-glow`}>
                  {getRankIcon(currentUserRank)}
                </div>
                <div>
                  <div className="text-4xl font-bold rainbow-text">#{currentUserRank}</div>
                  <div className="text-white/70 text-lg">dari {totalPlayers} pemain</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rankings List */}
      <div className="max-w-4xl mx-auto">
        {error ? (
          <div className="glass-card p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Error Loading Rankings</h3>
            <p className="text-white/70 mb-6">{error}</p>
            <Button onClick={fetchRankings}>Coba Lagi</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((player, index) => (
              <div
                key={player.id}
                className={`glass-card-enhanced p-6 transition-all duration-300 card-hover-3d bounce-in ${
                  player.id === user.id ? 'border-2 border-purple-400/50 bg-purple-500/10 floating' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${getRankBadge(player.rank)} flex items-center justify-center shadow-lg`}>
                      {player.rank <= 3 ? getRankIcon(player.rank) : <span className="text-white font-bold">{player.rank}</span>}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{player.nama}</h3>
                      <p className="text-white/60">@{player.username}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold gradient-text">{player.level}</div>
                        <div className="text-xs text-white/60">Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">{player.salah}</div>
                        <div className="text-xs text-white/60">Salah</div>
                      </div>
                    </div>
                  </div>
                </div>

                {player.id === user.id && (
                  <div className="mt-4 pt-4 border-t border-purple-400/30">
                    <div className="flex items-center justify-center text-purple-300">
                      <Star className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Ini adalah akun Anda</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {rankings.length === 0 && (
              <div className="glass-card-enhanced p-12 text-center floating slide-in-up">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold rainbow-text mb-3">Belum Ada Peringkat</h3>
                <p className="text-white/70 text-lg mb-6">Jadilah pemain pertama yang mencapai level tertinggi!</p>
                <Link href="/dashboard">
                  <Button variant="gradient" className="btn-hover-lift">
                    Mulai Bermain Sekarang
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}