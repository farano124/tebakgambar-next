'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Shield, Users, Settings, ArrowLeft, UserCheck, UserX } from 'lucide-react'

interface User {
  id: string
  nama: string
  username: string
  email: string
  level: number
  akses: number
  salah: number
  created_at: string
}

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    if (user) {
      checkAdminAccess()
    }
  }, [user, loading, router])

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        const adminStatus = userData.akses === 0
        setIsAdmin(adminStatus)

        if (adminStatus) {
          fetchUsers()
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/dashboard')
    }
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const userData = await response.json()
        setUsers(userData)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handlePromoteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('Error promoting user:', error)
    }
  }

  const handleDemoteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchUsers() // Refresh the list
      }
    } catch (error) {
      console.error('Error demoting user:', error)
    }
  }

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat panel admin...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
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
                <Shield className="w-10 h-10 mr-3 pulse-glow" />
                Panel Admin
              </h1>
              <p className="text-white/70">Kelola pengguna dan pengaturan sistem</p>
            </div>
          </div>
          <div className="slide-in-right">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center pulse-glow">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Stats */}
      <div className="max-w-6xl mx-auto mb-8 slide-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-enhanced p-6 text-center floating bounce-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold rainbow-text">{users.length}</div>
            <div className="text-white/70 font-medium">Total Pengguna</div>
          </div>

          <div className="glass-card-enhanced p-6 text-center floating bounce-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold rainbow-text">
              {users.filter(u => u.akses === 0).length}
            </div>
            <div className="text-white/70 font-medium">Admin</div>
          </div>

          <div className="glass-card-enhanced p-6 text-center floating bounce-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold rainbow-text">
              {users.filter(u => u.akses === 1).length}
            </div>
            <div className="text-white/70 font-medium">Pemain</div>
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="max-w-6xl mx-auto slide-in-up">
        <div className="glass-card-enhanced p-6 floating">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold rainbow-text flex items-center">
              <Users className="w-8 h-8 mr-3 pulse-glow" />
              Manajemen Pengguna
            </h2>
            <Button onClick={fetchUsers} variant="outline" size="sm" className="btn-hover-lift">
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={user.id} className="glass-card-enhanced p-4 border border-white/10 card-hover-3d bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.nama.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{user.nama}</h3>
                      <p className="text-white/60">@{user.username}</p>
                      <p className="text-white/60 text-sm">{user.email}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.akses === 0
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      }`}>
                        {user.akses === 0 ? 'Admin' : 'Pemain'}
                      </span>
                    </div>

                    <div className="text-sm text-white/60">
                      Level {user.level} • {user.salah} kesalahan
                    </div>

                    <div className="flex space-x-2 mt-3">
                      {user.akses === 1 ? (
                        <Button
                          onClick={() => handlePromoteUser(user.id)}
                          size="sm"
                          variant="success"
                          className="btn-hover-lift pulse-glow"
                        >
                          <UserCheck className="w-5 h-5 mr-2" />
                          Promote
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleDemoteUser(user.id)}
                          size="sm"
                          variant="warning"
                          className="btn-hover-lift"
                        >
                          <UserX className="w-5 h-5 mr-2" />
                          Demote
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="glass-card-enhanced p-12 text-center floating slide-in-up">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold rainbow-text mb-3">Tidak Ada Pengguna</h3>
                <p className="text-white/70 text-lg mb-6">Belum ada pengguna terdaftar</p>
                <Button variant="gradient" className="btn-hover-lift" onClick={fetchUsers}>
                  Refresh Data
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}