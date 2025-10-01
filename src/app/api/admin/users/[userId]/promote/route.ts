import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    userId: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createServerClient({
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any[]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cookiesToSet.forEach(({ name, value, options }: any) => {
            request.cookies.set({ name, value, ...options })
          })
        },
      },
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if current user is admin
    const { data: currentUserData } = await supabase
      .from('users')
      .select('akses')
      .eq('id', user.id)
      .single()

    if (!currentUserData || currentUserData.akses !== 0) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const resolvedParams = await params
    const targetUserId = resolvedParams.userId

    // Promote user to admin (akses = 0)
    const { error: promoteError } = await supabase
      .from('users')
      .update({ akses: 0 })
      .eq('id', targetUserId)

    if (promoteError) {
      console.error('Error promoting user:', promoteError)
      return NextResponse.json(
        { error: 'Failed to promote user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}