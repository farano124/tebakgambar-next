export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          username: string
          nama: string
          level: number
          akses: number // 0 = admin, 1 = user
          salah: number // wrong answers count
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          username: string
          nama: string
          level?: number
          akses?: number
          salah?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string
          nama?: string
          level?: number
          akses?: number
          salah?: number
          created_at?: string
          updated_at?: string
        }
      }
      levels: {
        Row: {
          id: string
          level: number
          gambar: string | null
          jawaban: string
          makna: string | null
          peribahasa: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          level: number
          gambar?: string | null
          jawaban: string
          makna?: string | null
          peribahasa?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          level?: number
          gambar?: string | null
          jawaban?: string
          makna?: string | null
          peribahasa?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          level: number
          completed: boolean
          attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          level: number
          completed?: boolean
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          level?: number
          completed?: boolean
          attempts?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Level = Database['public']['Tables']['levels']['Row']
export type UserProgress = Database['public']['Tables']['user_progress']['Row']