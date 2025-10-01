import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

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
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user rankings - ordered by level desc, then by salah asc (fewer wrong answers)
    const { data: rankings, error: rankingsError } = await supabase
      .from('users')
      .select(`
        id,
        nama,
        username,
        level,
        salah,
        created_at
      `)
      .eq('akses', 1) // Only regular users, not admins
      .order('level', { ascending: false })
      .order('salah', { ascending: true })
      .limit(50) // Top 50 players

    if (rankingsError) {
      console.error('Error fetching rankings:', rankingsError)
      return NextResponse.json(
        { error: 'Failed to fetch rankings' },
        { status: 500 }
      )
    }

    // Get total players count
    const { count: totalPlayersCount, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('akses', 1)

    if (countError) {
      console.error('Error counting total players:', countError)
    }

    const totalPlayers = totalPlayersCount || rankings.length

    // Add rank numbers and find current user's rank
    let currentUserRank = null
    const rankingsWithRank = rankings.map((player, index) => {
      const rank = index + 1

      // Find current user's rank
      if (player.id === user.id) {
        currentUserRank = rank
      }

      return {
        rank,
        id: player.id,
        nama: player.nama,
        username: player.username,
        level: player.level,
        salah: player.salah,
        created_at: player.created_at
      }
    })

    // If current user is not in top 50, get their specific ranking
    if (!currentUserRank) {
      const { data: userRankData, error: rpcError } = await supabase
        .rpc('get_user_rank', { user_id: user.id })

      if (rpcError) {
        console.error('RPC error:', rpcError)
        return NextResponse.json(
          { error: 'Failed to calculate user rank' },
          { status: 500 }
        )
      }

      if (userRankData) {
        currentUserRank = userRankData
      }
    }

    return NextResponse.json({
      rankings: rankingsWithRank,
      currentUserRank,
      totalPlayers
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}