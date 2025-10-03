import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json('Password is required', { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json('Password must be at least 6 characters', { status: 400 })
    }

    // Create server client with cookies to maintain the recovery session
    const cookieStore = await cookies()
    const supabase = createServerClient(cookieStore)

    // Update the password
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.error('Password update error:', error)
      return NextResponse.json(error.message, { status: 400 })
    }

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Unexpected error in reset password:', error)
    return NextResponse.json('Internal server error', { status: 500 })
  }
}