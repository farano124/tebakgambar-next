'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft, Trophy, Medal, Award, Crown, Star } from 'lucide-react'

interface RankingUser {
  rank: number
  id: string
  nama: string
  username: string
  level: number
  salah: number
  created_at: string
}

interface RankingsData {
  rankings: RankingUser[]
  currentUserRank: number | null
  totalPlayers: number
}

export default function RankingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [rankingsData, setRankingsData] = useState<RankingsData | null>(null)
  const [loadingRankings, setLoadingRankings] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('/api/rankings')
        if (response.ok) {
          const data = await response.json()
          setRankingsData(data)
        }
      } catch (error) {
        console.error('Error fetching rankings:', error)
      } finally {
        setLoadingRankings(false)
      }
    }

    if (user) {
      fetchRankings()
    }
  }, [user])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm">#{rank}</span>
    }
  }

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-white/10'
    }
  }

  if (loading || loadingRankings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat peringkat...</div>
      </div>
    )
  }

  if (!user || !rankingsData) {
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
              <h1 className="text-xl font-bold text-white flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                Peringkat Pemain
              </h1>
              <p className="text-white/60 text-sm">
                Top {rankingsData.rankings.length} pemain terbaik
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Current User Rank Highlight */}
      {rankingsData.currentUserRank && rankingsData.currentUserRank > 50 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-blue-500/20 backdrop-blur-md rounded-lg p-4 border border-blue-400/30">
            <div className="flex items-center justify-center space-x-4">
              <Star className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">
                Peringkat Anda: #{rankingsData.currentUserRank}
              </span>
              <Star className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* Rankings List */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-white/20 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-white font-semibold">
              <div className="col-span-2">Peringkat</div>
              <div className="col-span-4">Pemain</div>
              <div className="col-span-2 text-center">Level</div>
              <div className="col-span-2 text-center">Kesalahan</div>
              <div className="col-span-2 text-center">Bergabung</div>
            </div>
          </div>

          {/* Rankings Rows */}
          <div className="divide-y divide-white/10">
            {rankingsData.rankings.map((player) => (
              <div
                key={player.id}
                className={`px-6 py-4 hover:bg-white/5 transition-colors ${
                  player.id === user.id ? 'bg-blue-500/20 border-l-4 border-blue-400' : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBgColor(player.rank)}`}>
                      {getRankIcon(player.rank)}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="col-span-4">
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{player.nama}</span>
                      <span className="text-white/60 text-sm">@{player.username}</span>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="col-span-2 text-center">
                    <span className="text-white font-bold text-lg">{player.level}</span>
                  </div>

                  {/* Wrong Answers */}
                  <div className="col-span-2 text-center">
                    <span className="text-white/80">{player.salah}</span>
                  </div>

                  {/* Join Date */}
                  <div className="col-span-2 text-center">
                    <span className="text-white/60 text-sm">
                      {new Date(player.created_at).toLocaleDateString('id-ID', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{rankingsData.totalPlayers}</div>
              <div className="text-white/60">Total Pemain</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {rankingsData.rankings[0]?.level || 0}
              </div>
              <div className="text-white/60">Level Tertinggi</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {rankingsData.currentUserRank ? `#${rankingsData.currentUserRank}` : '-'}
              </div>
              <div className="text-white/60">Peringkat Anda</div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}