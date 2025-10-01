import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    userId: string
  }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Cannot delete yourself
    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete yourself' },
        { status: 400 }
      )
    }

    // Delete user from our database (this will cascade delete user_progress)
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', targetUserId)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      )
    }

    // Note: We don't delete from Supabase Auth as that might be handled separately
    // The user profile is deleted from our database

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}