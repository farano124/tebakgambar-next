'use client'

import { useState, FormEvent, memo, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, UserCheck } from 'lucide-react'

export const RegisterForm = memo(function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    nama: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.email || !formData.password || !formData.username || !formData.nama) {
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      alert('Password minimal 6 karakter')
      return
    }

    setLoading(true)
    try {
      await signUp(formData.email, formData.password, formData.username, formData.nama)
    } finally {
      setLoading(false)
    }
  }, [formData, signUp])

  const isFormValid = formData.email && formData.password && formData.confirmPassword &&
                     formData.username && formData.nama && formData.password === formData.confirmPassword

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Daftar</h1>
          <p className="text-white/80">Buat akun Tebak Gambar baru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-12 bg-white/20 border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="Nama lengkap Anda"
                required
              />
              <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-12 bg-white/20 border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="Username unik"
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-12 pr-12 bg-white/20 border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="Minimal 6 karakter"
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

          <div>
            <label className="block text-white font-medium mb-2">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-12 pr-12 bg-white/20 border border-white/30 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                placeholder="Ulangi password"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full"
            size="lg"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/80">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-white hover:underline font-semibold">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
})