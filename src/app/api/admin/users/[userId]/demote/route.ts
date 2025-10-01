import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    userId: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userData, error: userCheckError } = await supabase
      .from('users')
      .select('akses')
      .eq('id', user.id)
      .single()

    if (userCheckError || userData?.akses !== 0) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const resolvedParams = await params
    const targetUserId = resolvedParams.userId

    // Cannot demote yourself
    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: 'Cannot demote yourself' },
        { status: 400 }
      )
    }

    // Demote admin to regular user (akses = 1)
    const { data, error } = await supabase
      .from('users')
      .update({
        akses: 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', targetUserId)
      .select()
      .single()

    if (error) {
      console.error('Error demoting user:', error)
      return NextResponse.json(
        { error: 'Failed to demote user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User demoted to regular user successfully',
      user: data
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}