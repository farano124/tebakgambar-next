import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { User } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  let user: User | null = null
  let level: string = ''
  let userAnswer: string = ''

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
    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()
    user = authUser

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure user profile exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
          nama: user.user_metadata?.nama || user.user_metadata?.full_name || 'User',
          level: 1,
          akses: 1, // Regular user
          salah: 0
        })

      if (createUserError) {
        console.error('Error creating user profile:', createUserError)
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }
    }

    const body = await request.json()
    const { level: levelParam, answer: answerParam } = body
    level = levelParam
    userAnswer = answerParam

    console.log('Check answer API - User:', user?.id, 'Level:', level, 'Answer:', userAnswer)

    if (!level || !userAnswer) {
      return NextResponse.json(
        { error: 'Level and answer are required' },
        { status: 400 }
      )
    }

    const levelNumber = parseInt(level)
    if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 100) {
      return NextResponse.json(
        { error: 'Invalid level number' },
        { status: 400 }
      )
    }

    // Get the correct answer from database
    const { data: levelData, error: levelError } = await supabase
      .from('levels')
      .select('jawaban, makna, peribahasa')
      .eq('level', levelNumber)
      .single()

    if (levelError || !levelData) {
      return NextResponse.json(
        { error: 'Level not found' },
        { status: 404 }
      )
    }

    // Normalize answers for comparison (remove spaces, convert to uppercase)
    const normalizedUserAnswer = userAnswer.replace(/\s+/g, '').toUpperCase()
    const normalizedCorrectAnswer = levelData.jawaban.replace(/\s+/g, '').toUpperCase()

    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer

    // Get or create user progress
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('attempts, completed')
      .eq('user_id', user.id)
      .eq('level', levelNumber)
      .single()

    let newAttempts = 1
    let isCompleted = isCorrect

    if (existingProgress) {
      newAttempts = existingProgress.attempts + 1
      isCompleted = existingProgress.completed || isCorrect
    }

    // Update or insert user progress (handle conflict on user_id+level)
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          level: levelNumber,
          completed: isCompleted,
          attempts: newAttempts
        },
        { onConflict: 'user_id,level' }
      )

    if (progressError) {
      console.error('Error updating progress:', progressError)
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    // If correct and this level was not completed before, update user level
    if (isCorrect && !existingProgress?.completed) {
      const { data: userData } = await supabase
        .from('users')
        .select('level')
        .eq('id', user.id)
        .single()

      const currentLevel = userData?.level || 1
      const newLevel = Math.max(currentLevel, levelNumber + 1)

      if (newLevel > currentLevel) {
        console.log('Updating user level to:', newLevel)
        const { error: levelUpdateError } = await supabase
          .from('users')
          .update({
            level: newLevel
          })
          .eq('id', user.id)

        console.log('User level update error:', levelUpdateError)
      }
    }

    return NextResponse.json({
      correct: isCorrect,
      attempts: newAttempts,
      levelCompleted: isCompleted,
      answer: isCorrect ? {
        makna: levelData.makna,
        peribahasa: levelData.peribahasa
      } : null
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}