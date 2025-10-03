'use client'

import { useState, FormEvent, memo, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export const LoginForm = memo(function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    try {
      await signIn(email, password)
    } finally {
      setLoading(false)
    }
  }, [email, password, signIn])

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Masuk</h1>
          <p className="text-white/80">Masuk ke akun Tebak Gambar Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/20 border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="nama@email.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-12 bg-white/20 border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="Password Anda"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full"
            size="lg"
          >
            {loading ? 'Sedang Masuk...' : 'Masuk'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-white/80">
            <Link href="/forgot-password" className="text-white hover:underline font-semibold hover:text-purple-300 transition-colors duration-200">
              Lupa Password?
            </Link>
          </p>
          <p className="text-white/80">
            Belum punya akun?{' '}
            <Link href="/register" className="text-white hover:underline font-semibold">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
})