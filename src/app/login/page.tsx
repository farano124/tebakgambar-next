'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Email dan password harus diisi')
      return
    }

    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch {
      // Error already handled in signIn function
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-4xl font-bold rainbow-text mb-2 font-display">Masuk</h1>
            <p className="text-white/70">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="slide-in-left">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div className="slide-in-right">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white/80">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                  Lupa Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="Password Anda"
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
                  Sedang Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>

          <div className="text-center mt-6 slide-in-up">
            <p className="text-white/70">
              Belum punya akun?{' '}
              <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:scale-105 inline-block">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}