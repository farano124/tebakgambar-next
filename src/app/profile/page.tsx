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

  // Password change modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)

  // Notification settings modal
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    achievementNotifications: true
  })
  const [savingNotifications, setSavingNotifications] = useState(false)

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

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Semua field password harus diisi')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak cocok')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password baru harus minimal 6 karakter')
      return
    }

    setChangingPassword(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      })

      if (response.ok) {
        toast.success('Password berhasil diubah! 🎉')
        setIsPasswordModalOpen(false)
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        toast.error(errorData.error || 'Gagal mengubah password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Terjadi kesalahan saat mengubah password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSavingNotifications(true)
    try {
      // For now, just show success since backend isn't implemented yet
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast.success('Pengaturan notifikasi berhasil disimpan! 🎉')
      setIsNotificationModalOpen(false)
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setSavingNotifications(false)
    }
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
  
        {/* Password Change Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card-enhanced p-6 w-full max-w-md bounce-in">
              <h2 className="text-2xl font-bold rainbow-text mb-6">Ubah Password</h2>
  
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Password Saat Ini</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    placeholder="Masukkan password saat ini"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Password Baru</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    placeholder="Masukkan password baru"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    placeholder="Konfirmasi password baru"
                  />
                </div>
              </div>
  
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                  variant="success"
                  className="flex-1"
                >
                  {changingPassword ? 'Mengubah...' : 'Ubah Password'}
                </Button>
                <Button
                  onClick={() => {
                    setIsPasswordModalOpen(false)
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  }}
                  variant="outline"
                  disabled={changingPassword}
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        )}
  
        {/* Notification Settings Modal */}
        {isNotificationModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass-card-enhanced p-6 w-full max-w-md bounce-in">
              <h2 className="text-2xl font-bold rainbow-text mb-6">Pengaturan Notifikasi</h2>
  
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Notifikasi Email</p>
                    <p className="text-white/60 text-sm">Terima notifikasi melalui email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
  
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Notifikasi Push</p>
                    <p className="text-white/60 text-sm">Terima notifikasi push di browser</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
  
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Notifikasi Achievement</p>
                    <p className="text-white/60 text-sm">Notifikasi saat mendapat achievement baru</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.achievementNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, achievementNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
  
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={savingNotifications}
                  variant="success"
                  className="flex-1"
                >
                  {savingNotifications ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button
                  onClick={() => setIsNotificationModalOpen(false)}
                  variant="outline"
                  disabled={savingNotifications}
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        )}
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
              <h1 className="text-4xl font-bold rainbow-text font-display">Profil Pengguna</h1>
              <p className="text-white/70">Kelola informasi akun Anda</p>
            </div>
          </div>
          <div className="slide-in-right">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center pulse-glow">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="glass-card-enhanced p-6 floating bounce-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3 slide-in-left">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center pulse-glow">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold rainbow-text">Informasi Dasar</h2>
                  <p className="text-white/70 text-sm">Data pribadi Anda</p>
                </div>
              </div>

              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="btn-hover-lift slide-in-right"
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
                      className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
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
                      className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
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
                <Button
                  onClick={() => setIsPasswordModalOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  Ubah
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Notifikasi</p>
                  <p className="text-white/60 text-sm">Kelola preferensi notifikasi</p>
                </div>
                <Button
                  onClick={() => setIsNotificationModalOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  Atur
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Game Stats */}
          <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold rainbow-text mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 pulse-glow" />
              Statistik Game
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors card-hover-3d">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80">Level Saat Ini</span>
                </div>
                <span className="text-2xl font-bold rainbow-text">{userProfile.level}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors card-hover-3d">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80">Total Kesalahan</span>
                </div>
                <span className="text-xl font-bold text-red-400">{userProfile.salah}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors card-hover-3d">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80">Progress</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">
                  {Math.round((userProfile.level / 100) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold rainbow-text mb-4">Aksi Cepat</h3>

            <div className="space-y-3">
              <Link href="/game">
                <Button variant="gradient" className="w-full btn-hover-lift pulse-glow">
                  <Trophy className="w-5 h-5 mr-2" />
                  Main Game
                </Button>
              </Link>

              <Link href="/achievements">
                <Button variant="warning" className="w-full btn-hover-lift">
                  <Award className="w-5 h-5 mr-2" />
                  Lihat Achievements
                </Button>
              </Link>

              <Link href="/rankings">
                <Button variant="secondary" className="w-full btn-hover-lift">
                  <Target className="w-5 h-5 mr-2" />
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