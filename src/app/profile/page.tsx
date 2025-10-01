'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft, User, Edit, Save, Trophy, Target, Clock, Award } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  nama: string
  username: string
  level: number
  salah: number
  email: string
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    nama: '',
    username: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user, loading, router])

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true)
      setProfileError(null)
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
        setEditForm({
          nama: data.nama,
          username: data.username
        })
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

  const handleSaveProfile = async () => {
    if (!editForm.nama.trim() || !editForm.username.trim()) {
      toast.error('Nama dan username tidak boleh kosong')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setUserProfile(updatedData)
        setIsEditing(false)
        toast.success('Profil berhasil diperbarui! 🎉')
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        toast.error(errorData.error || 'Gagal memperbarui profil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Terjadi kesalahan saat memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditForm({
      nama: userProfile?.nama || '',
      username: userProfile?.username || ''
    })
    setIsEditing(false)
  }

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat profil...</div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>

          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
            <p className="text-white/80 mb-6">{profileError}</p>
            <Button onClick={fetchUserProfile} className="w-full">
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return null // Will redirect
  }

  const joinDate = new Date(userProfile.created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <nav className="glass-card p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold gradient-text font-display">Profil Pengguna</h1>
              <p className="text-white/70">Kelola informasi akun Anda</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">Informasi Dasar</h2>
                  <p className="text-white/70 text-sm">Data pribadi Anda</p>
                </div>
              </div>

              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Nama Lengkap</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.nama}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nama: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      maxLength={100}
                    />
                  ) : (
                    <p className="text-white font-medium text-lg">{userProfile.nama}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                      maxLength={50}
                    />
                  ) : (
                    <p className="text-white font-medium text-lg">@{userProfile.username}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <p className="text-white/80">{userProfile.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Bergabung Sejak</label>
                <p className="text-white/80">{joinDate}</p>
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4 border-t border-white/20">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    variant="success"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    disabled={saving}
                  >
                    Batal
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold gradient-text mb-4">Pengaturan Akun</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Ubah Password</p>
                  <p className="text-white/60 text-sm">Perbarui kata sandi akun Anda</p>
                </div>
                <Button variant="outline" size="sm">
                  Ubah
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Notifikasi</p>
                  <p className="text-white/60 text-sm">Kelola preferensi notifikasi</p>
                </div>
                <Button variant="outline" size="sm">
                  Atur
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Game Stats */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold gradient-text mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Statistik Game
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-white/80">Level Saat Ini</span>
                </div>
                <span className="text-2xl font-bold gradient-text">{userProfile.level}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white/80">Total Kesalahan</span>
                </div>
                <span className="text-xl font-bold text-red-400">{userProfile.salah}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-white/80">Progress</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">
                  {Math.round((userProfile.level / 100) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold gradient-text mb-4">Aksi Cepat</h3>

            <div className="space-y-3">
              <Link href="/game">
                <Button variant="gradient" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Main Game
                </Button>
              </Link>

              <Link href="/achievements">
                <Button variant="warning" className="w-full">
                  <Award className="w-4 h-4 mr-2" />
                  Lihat Achievements
                </Button>
              </Link>

              <Link href="/rankings">
                <Button variant="secondary" className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Lihat Ranking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}