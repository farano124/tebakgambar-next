import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json('Email is required', { status: 400 })
    }

    // Create server client without cookies since we don't need session management
    const supabase = createServerClient()

    // For development, use localhost. In production, use the actual domain
    const redirectTo = process.env.NODE_ENV === 'production'
      ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/reset-password`
      : 'http://localhost:3000/reset-password'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    })

    if (error) {
      console.error('Password reset error:', error)
      return NextResponse.json(error.message, { status: 400 })
    }

    return NextResponse.json({ message: 'Password reset email sent' })
  } catch (error) {
    console.error('Unexpected error in forgot password:', error)
    return NextResponse.json('Internal server error', { status: 500 })
  }
}