'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat...</div>
      </div>
    )
  }

  // Don't render anything if user is authenticated (will redirect)
  if (user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Email harus diisi')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password',
      })

      if (error) {
        toast.error(error.message || 'Gagal mengirim email reset password')
      } else {
        setIsSubmitted(true)
        toast.success('Email reset password telah dikirim')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Terjadi kesalahan, silakan coba lagi')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen p-4 slide-in-up">
        <div className="max-w-md mx-auto">
          <Link href="/login">
            <Button variant="outline" size="sm" className="mb-8 btn-hover-lift">
              ← Kembali ke Login
            </Button>
          </Link>

          <div className="glass-card-enhanced p-8 floating bounce-in text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold rainbow-text mb-4 font-display">Email Terkirim!</h1>
            <p className="text-white/70 mb-6">
              Kami telah mengirimkan link reset password ke email Anda. Silakan periksa inbox Anda dan ikuti instruksi untuk mengatur ulang password.
            </p>
            <Link href="/login">
              <Button className="btn-hover-lift pulse-glow" variant="gradient">
                Kembali ke Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 slide-in-up">
      <div className="max-w-md mx-auto">
        <Link href="/login">
          <Button variant="outline" size="sm" className="mb-8 btn-hover-lift">
            ← Kembali ke Login
          </Button>
        </Link>

        <div className="glass-card-enhanced p-8 floating bounce-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold rainbow-text mb-2 font-display">Lupa Password</h1>
            <p className="text-white/70">Masukkan email Anda untuk menerima link reset password</p>
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-hover-lift pulse-glow"
              variant="gradient"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Mengirim...
                </>
              ) : (
                'Kirim Link Reset'
              )}
            </Button>
          </form>

          <div className="text-center mt-6 slide-in-up">
            <p className="text-white/70">
              Ingat password Anda?{' '}
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