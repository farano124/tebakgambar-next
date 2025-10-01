import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ level: string }> }) {
  try {
    console.log('🎮 Level API called')

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

    console.log('🔗 Supabase client created')

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('👤 User check result:', { user: user?.id, error: userError?.message })

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const levelNumber = parseInt(resolvedParams.level)
    if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 100) {
      return NextResponse.json(
        { error: 'Invalid level number' },
        { status: 400 }
      )
    }

    // Get level data
    const { data: level, error: levelError } = await supabase
      .from('levels')
      .select('id, level, gambar, jawaban, makna, peribahasa')
      .eq('level', levelNumber)
      .single()

    if (levelError || !level) {
      return NextResponse.json(
        { error: 'Level not found' },
        { status: 404 }
      )
    }

    // Get user's progress for this level
    const { data: progress } = await supabase
      .from('user_progress')
      .select('completed, attempts')
      .eq('user_id', user.id)
      .eq('level', levelNumber)
      .single()

    // Check if user has access to this level (must complete previous levels)
    const { data: userProfile } = await supabase
      .from('users')
      .select('level')
      .eq('id', user.id)
      .single()

    const userCurrentLevel = userProfile?.level || 1
    const hasAccess = levelNumber <= userCurrentLevel

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Level not unlocked yet' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      level: level.level,
      gambar: level.gambar,
      jawaban: level.jawaban,
      makna: level.makna,
      peribahasa: level.peribahasa,
      progress: progress ? {
        completed: progress.completed,
        attempts: progress.attempts
      } : null
    })

  } catch (error) {
    console.error('API error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}