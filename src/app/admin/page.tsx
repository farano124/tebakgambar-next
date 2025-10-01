'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  Plus,
  Settings,
  Shield,
  BarChart3,
  UserCheck,
  UserX,
  Edit,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  nama: string
  username: string
  email: string
  level: number
  akses: number
  salah: number
  created_at: string
  updated_at: string
}

interface AdminStats {
  totalUsers: number
  totalLevels: number
  activeUsers: number
  adminUsers: number
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingAdmin, setLoadingAdmin] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'levels'>('overview')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
      return
    }

    checkAdminAccess()
  }, [user, loading, router])

  const checkAdminAccess = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        const adminAccess = userData.akses === 0 // 0 = admin in original system
        setIsAdmin(adminAccess)

        if (adminAccess) {
          await loadAdminData()
        }
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      setIsAdmin(false)
    } finally {
      setLoadingAdmin(false)
    }
  }

  const loadAdminData = async () => {
    try {
      // Load users
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])

        // Calculate stats
        const totalUsers = usersData.users?.length || 0
        const activeUsers = usersData.users?.filter((u: User) => u.akses === 1).length || 0
        const adminUsers = totalUsers - activeUsers

        setStats({
          totalUsers,
          totalLevels: 100, // We know we have 100 levels
          activeUsers,
          adminUsers
        })
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
      toast.error('Gagal memuat data admin')
    }
  }

  const handleUserAction = async (userId: string, action: 'promote' | 'demote' | 'delete') => {
    try {
      let endpoint = ''
      let method = 'POST'
      const body = {}

      switch (action) {
        case 'promote':
          endpoint = `/api/admin/users/${userId}/promote`
          break
        case 'demote':
          endpoint = `/api/admin/users/${userId}/demote`
          break
        case 'delete':
          endpoint = `/api/admin/users/${userId}`
          method = 'DELETE'
          break
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method !== 'DELETE' ? JSON.stringify(body) : undefined,
      })

      if (response.ok) {
        toast.success('Aksi berhasil!')
        await loadAdminData() // Reload data
      } else {
        throw new Error('Failed to perform action')
      }
    } catch (error) {
      console.error('Error performing user action:', error)
      toast.error('Gagal melakukan aksi')
    }
  }

  if (loading || loadingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat dashboard admin...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-white/80 mb-4">
            Anda tidak memiliki akses ke halaman admin.
          </p>
          <Link href="/dashboard">
            <Button>
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
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
                <Shield className="w-6 h-6 mr-2 text-yellow-400" />
                Dashboard Admin
              </h1>
              <p className="text-white/60 text-sm">
                Kelola pengguna dan level permainan
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 mb-8">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Ringkasan', icon: BarChart3 },
            { id: 'users', label: 'Pengguna', icon: Users },
            { id: 'levels', label: 'Level', icon: Plus },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'users' | 'levels')}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Pengguna</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pemain Aktif</p>
                <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Administrator</p>
                <p className="text-2xl font-bold text-white">{stats.adminUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Level</p>
                <p className="text-2xl font-bold text-white">{stats.totalLevels}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-bold text-white mb-2">Manajemen Pengguna</h2>
            <p className="text-white/60">Kelola pengguna aplikasi</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Kesalahan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{user.nama}</div>
                        <div className="text-sm text-white/60">@{user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.akses === 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.akses === 0 ? 'Admin' : 'Pemain'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.salah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {user.akses === 1 ? (
                        <Button
                          size="sm"
                          onClick={() => handleUserAction(user.id, 'promote')}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'demote')}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleUserAction(user.id, 'delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'levels' && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Manajemen Level</h2>
              <p className="text-white/60">Tambah atau edit level permainan</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Level
            </Button>
          </div>

          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Fitur Dalam Pengembangan</h3>
            <p className="text-white/60">
              Manajemen level akan segera tersedia dengan kemampuan untuk menambah,
              mengedit, dan menghapus level permainan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}