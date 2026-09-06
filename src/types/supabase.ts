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
      professionals: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          role: string
          council_type: string
          council_number: string
          council_state: string
          specialty: string
          avatar_url: string | null
          status: string
          prescriber_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          role?: string
          council_type: string
          council_number: string
          council_state: string
          specialty: string
          avatar_url?: string | null
          status?: string
          prescriber_type?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          role?: string
          council_type?: string
          council_number?: string
          council_state?: string
          specialty?: string
          avatar_url?: string | null
          status?: string
          prescriber_type?: string
        }
      }
      patients: {
        Row: {
          id: string
          created_at: string
          professional_id: string
          name: string
          email: string | null
          phone: string | null
          birth_date: string | null
          gender: string | null
          objective: string | null
          status: string
          last_consultation: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          professional_id: string
          name: string
          email?: string | null
          phone?: string | null
          birth_date?: string | null
          gender?: string | null
          objective?: string | null
          status?: string
          last_consultation?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          professional_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          birth_date?: string | null
          gender?: string | null
          objective?: string | null
          status?: string
          last_consultation?: string | null
        }
      }
      meal_plans: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          professional_id: string
          title: string
          description: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          professional_id: string
          title: string
          description?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          professional_id?: string
          title?: string
          description?: string | null
          is_active?: boolean
        }
      }
      prescriptions: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          professional_id: string
          content: Json
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          professional_id: string
          content: Json
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          professional_id?: string
          content?: Json
          status?: string
        }
      }
      exam_requisitions: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          professional_id: string
          exams: string[]
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          professional_id: string
          exams: string[]
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          professional_id?: string
          exams?: string[]
          notes?: string | null
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
