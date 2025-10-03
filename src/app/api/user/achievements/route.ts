import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { ACHIEVEMENTS, GameStats, Achievement } from '@/lib/achievements'

export async function GET(request: NextRequest) {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user achievements
    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false })

    if (error) {
      console.error('Error fetching achievements:', error)
      return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
    }

    return NextResponse.json((userAchievements || []).map((ua) => ({
      achievementId: ua.achievement_id,
      unlockedAt: ua.unlocked_at,
      progress: ua.progress
    })))
  } catch (error) {
    console.error('Achievements API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { achievementId, progress }: { achievementId: string, progress: GameStats } = await request.json()

    if (!achievementId) {
      return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 })
    }

    // Check if achievement already exists
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .eq('achievement_id', achievementId)
      .single()

    if (existingAchievement) {
      return NextResponse.json({ error: 'Achievement already unlocked' }, { status: 409 })
    }

    // Find the achievement definition
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }

    // Verify achievement criteria (basic check)
    const isValid = validateAchievementCriteria(achievement, progress)
    if (!isValid) {
      return NextResponse.json({ error: 'Achievement criteria not met' }, { status: 400 })
    }

    // Insert the achievement
    const progressValue = progress ? getProgressValue(achievement.criteria.type, progress) : 0
    const { data: newAchievement, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: user.id,
        achievement_id: achievementId,
        progress: progressValue,
      })
      .select()
      .single()

    if (error) {
      console.error('Error unlocking achievement:', error)
      return NextResponse.json({ error: 'Failed to unlock achievement' }, { status: 500 })
    }

    // Award XP if achievement has rewards
    if (achievement.reward.xp && achievement.reward.xp > 0) {
      // This would typically update a user_xp or similar table
      // For now, we'll just return the achievement data
    }

    return NextResponse.json({
      success: true,
      achievement: {
        ...achievement,
        unlockedAt: newAchievement.unlocked_at
      }
    })
  } catch (error) {
    console.error('Achievement unlock API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function validateAchievementCriteria(achievement: Achievement, progress: GameStats): boolean {
  if (!progress) return false

  const { criteria } = achievement
  const currentValue = getProgressValue(criteria.type, progress)

  switch (criteria.comparison || 'gte') {
    case 'gte':
      return currentValue >= criteria.value
    case 'lte':
      return currentValue <= criteria.value
    case 'eq':
      return currentValue === criteria.value
    default:
      return currentValue >= criteria.value
  }
}

function getProgressValue(type: string, progress: GameStats): number {
  switch (type) {
    case 'level_reached':
      return progress.currentLevel
    case 'correct_answers':
      return progress.totalCorrect
    case 'streak':
      return progress.currentStreak
    case 'hints_used':
      return progress.hintsUsed
    case 'time_played':
      return progress.totalTimePlayed
    case 'games_played':
      return progress.gamesPlayed
    case 'perfect_level':
      return progress.perfectLevels
    default:
      return 0
  }
}