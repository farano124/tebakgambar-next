import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <LoginForm />

        <div className="text-center text-white/80">
          <Link href="/guide" className="hover:underline">
            Cek cara mainnya
          </Link>
        </div>
      </div>
    </div>
  )
}