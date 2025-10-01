'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { user, loading, signUp } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    nama: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.username || !formData.nama) {
      toast.error('Semua field harus diisi')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    setIsLoading(true)
    try {
      await signUp(formData.email, formData.password, formData.username, formData.nama)
      // Note: signUp will show success message and redirect will be handled by auth state change
    } catch (error) {
      // Error already handled in signUp function
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat...</div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen p-4 slide-in-up">
      <div className="max-w-md mx-auto">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-8 btn-hover-lift">
            ← Kembali ke Beranda
          </Button>
        </Link>

        <div className="glass-card-enhanced p-8 floating bounce-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold rainbow-text mb-2 font-display">Daftar</h1>
            <p className="text-white/70">Buat akun baru untuk bermain</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="slide-in-left">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleInputChange('nama', e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="Nama lengkap Anda"
                required
              />
            </div>

            <div className="slide-in-right">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="username_unik"
                required
              />
            </div>

            <div className="slide-in-left">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div className="slide-in-right">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div className="slide-in-left">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="Ulangi password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-hover-lift pulse-glow"
              variant="gradient"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Mendaftarkan...
                </>
              ) : (
                'Daftar'
              )}
            </Button>
          </form>

          <div className="text-center mt-6 slide-in-up">
            <p className="text-white/70">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:scale-105 inline-block">
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}