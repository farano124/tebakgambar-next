'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { LoginForm } from '@/components/auth/LoginForm'
import { Gamepad2, Trophy, Users, Zap } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat...</div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen slide-in-up">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16 slide-in-up">
            <h1 className="text-6xl md:text-7xl font-bold rainbow-text mb-6 font-display animate-pulse">
              Tebak Gambar
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tantang pengetahuanmu dengan permainan tebak gambar yang seru!
              Teka gambar dan dapatkan poin untuk mendaki puncak papan peringkat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/login">
                <Button variant="gradient" size="lg" className="btn-hover-lift pulse-glow">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Mulai Bermain
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg" className="btn-hover-lift">
                  <Users className="w-5 h-5 mr-2" />
                  Daftar Akun
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card-enhanced p-6 text-center bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold rainbow-text mb-2">100+ Level</h3>
              <p className="text-white/80">Koleksi gambar yang beragam dari mudah hingga sulit</p>
            </div>

            <div className="glass-card-enhanced p-6 text-center bounce-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold rainbow-text mb-2">Papan Peringkat</h3>
              <p className="text-white/80">Bersaing dengan pemain lain dan dapatkan gelar tertinggi</p>
            </div>

            <div className="glass-card-enhanced p-6 text-center bounce-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold rainbow-text mb-2">Achievements</h3>
              <p className="text-white/80">Kumpulkan badge dan unlock prestasi menarik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="max-w-md mx-auto px-4 pb-12 slide-in-up">
        <div className="glass-card-enhanced p-8 floating">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold rainbow-text mb-2">Masuk untuk Bermain</h2>
            <p className="text-white/70">Sudah punya akun? Masuk sekarang</p>
          </div>

          <LoginForm />

          <div className="text-center mt-6 space-y-3">
            <div className="text-white/80">
              <Link href="/guide" className="hover:text-purple-300 transition-colors duration-200 hover:scale-105 inline-block">
                📖 Cek cara mainnya
              </Link>
            </div>

            <div className="text-white/60 text-sm">
              &copy; Tebak Gambar 2024 - Dibuat dengan ❤️ menggunakan Next.js
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
