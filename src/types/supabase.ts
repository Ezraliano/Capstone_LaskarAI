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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scans: {
        Row: {
          id: string
          user_id: string
          image_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      scan_results: {
        Row: {
          id: string
          scan_id: string
          condition_name: string
          severity: string
          description: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          condition_name: string
          severity: string
          description?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          condition_name?: string
          severity?: string
          description?: string | null
          location?: string | null
          created_at?: string
        }
      }
    }
  }
}