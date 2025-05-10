export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          provider_id: string
          client_id: string
          service_id: string
          date: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          type: 'orçamento' | 'reparo'
          location: string
          tenant: string
          description: string
          approved_value: number | null
          rating: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          client_id: string
          service_id: string
          date: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          type: 'orçamento' | 'reparo'
          location: string
          tenant: string
          description: string
          approved_value?: number | null
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          client_id?: string
          service_id?: string
          date?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          type?: 'orçamento' | 'reparo'
          location?: string
          tenant?: string
          description?: string
          approved_value?: number | null
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          duration: number
          price: number
          provider_id: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          duration: number
          price: number
          provider_id: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          duration?: number
          price?: number
          provider_id?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'provider' | 'client' | 'admin' | 'imobiliaria'
          phone: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'provider' | 'client' | 'admin' | 'imobiliaria'
          phone?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'provider' | 'client' | 'admin' | 'imobiliaria'
          phone?: string | null
          avatar?: string | null
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