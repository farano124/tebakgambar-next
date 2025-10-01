'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

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
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <LoginForm />

        <div className="text-center text-white/80">
          <Link href="/guide" className="hover:underline">
            Cek cara mainnya
          </Link>
        </div>

        <div className="text-center text-white/60 text-sm">
          &copy; Tebak Gambar 2024 - Dibuat dengan Next.js
        </div>
      </div>
    </div>
  )
}
