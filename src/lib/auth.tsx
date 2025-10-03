'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, nama: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasHandledSignIn, setHasHandledSignIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle auth state changes
        if (event === 'SIGNED_IN' && !hasHandledSignIn) {
          setHasHandledSignIn(true)

          // Check if this is a recovery session
          const isRecoverySession = window.location.pathname === '/reset-password' || window.location.hash.includes('type=recovery')

          if (!isRecoverySession) {
            toast.success('Berhasil masuk!')
            router.push('/dashboard')
          }
          // For recovery sessions, stay on the reset-password page
        } else if (event === 'SIGNED_OUT') {
          setHasHandledSignIn(false)
          toast.success('Berhasil keluar')
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, hasHandledSignIn])

  const signIn = async (email: string, password: string) => {
    try {
      // Reset the sign-in handling flag for new attempts
      setHasHandledSignIn(false)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Sign in error:', error)
      const message = error instanceof Error ? error.message : 'Gagal masuk'
      toast.error(message)
      throw error
    }
  }

  const signUp = async (email: string, password: string, username: string, nama: string) => {
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            nama,
          }
        }
      })

      if (error) {
        throw error
      }

      // If signup successful, create user profile in our database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username,
            nama,
            level: 1,
            akses: 1, // Regular user
            salah: 0
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Don't throw here as the auth user was created successfully
        }
      }

      toast.success('Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi.')
    } catch (error) {
      console.error('Sign up error:', error)
      const message = error instanceof Error ? error.message : 'Gagal mendaftar'
      toast.error(message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Sign out error:', error)
      const message = error instanceof Error ? error.message : 'Gagal keluar'
      toast.error(message)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}