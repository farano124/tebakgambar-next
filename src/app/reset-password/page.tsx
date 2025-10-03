'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    // For password reset, Supabase automatically establishes a recovery session
    // We just need to check if user is authenticated when they reach this page
    if (user) {
      // User is authenticated, allow password reset
      setIsValidToken(true)
    } else {
      // Wait a moment for Supabase to process the recovery session
      const timer = setTimeout(() => {
        if (!user) {
          toast.error('Sesi reset password tidak valid. Silakan coba lagi.')
          router.push('/login')
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Semua field harus diisi')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Password tidak cocok')
      return
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        toast.error(error.message || 'Gagal mengubah password')
      } else {
        toast.success('Password berhasil diubah!')
        router.push('/login')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Terjadi kesalahan, silakan coba lagi')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memverifikasi token...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 slide-in-up">
      <div className="max-w-md mx-auto">
        <div className="glass-card-enhanced p-8 floating bounce-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold rainbow-text mb-2 font-display">Atur Ulang Password</h1>
            <p className="text-white/70">Masukkan password baru Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="slide-in-left">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password Baru
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="Password baru"
                required
                minLength={6}
              />
            </div>

            <div className="slide-in-right">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-enhanced w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus-ring"
                placeholder="Konfirmasi password"
                required
                minLength={6}
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
                  Mengubah Password...
                </>
              ) : (
                'Ubah Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
