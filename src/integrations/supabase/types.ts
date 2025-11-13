export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          latitude: number
          longitude: number
          resolved_at: string | null
          status: Database["public"]["Enums"]["alert_status"] | null
          title: string
          type: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["alert_status"] | null
          title: string
          type: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["alert_status"] | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      charging_stations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_available: boolean | null
          latitude: number
          longitude: number
          name: string
          power_kw: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          latitude: number
          longitude: number
          name: string
          power_kw?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          power_kw?: number | null
        }
        Relationships: []
      }
      electric_vehicles: {
        Row: {
          battery_capacity: number | null
          created_at: string | null
          id: string
          is_available: boolean | null
          latitude: number
          longitude: number
          model: string
          name: string
          range_km: number | null
          year: number | null
        }
        Insert: {
          battery_capacity?: number | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          latitude: number
          longitude: number
          model: string
          name: string
          range_km?: number | null
          year?: number | null
        }
        Update: {
          battery_capacity?: number | null
          created_at?: string | null
          id?: string
          is_available?: boolean | null
          latitude?: number
          longitude?: number
          model?: string
          name?: string
          range_km?: number | null
          year?: number | null
        }
        Relationships: []
      }
      parking_spots: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_available: boolean | null
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          resource_id: string
          resource_type: Database["public"]["Enums"]["resource_type"]
          start_time: string
          status: Database["public"]["Enums"]["reservation_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          resource_id: string
          resource_type: Database["public"]["Enums"]["resource_type"]
          start_time: string
          status?: Database["public"]["Enums"]["reservation_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          resource_id?: string
          resource_type?: Database["public"]["Enums"]["resource_type"]
          start_time?: string
          status?: Database["public"]["Enums"]["reservation_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      revision_spaces: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          is_available: boolean | null
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_available?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          includes_charging: boolean | null
          includes_parking: boolean | null
          includes_revision: boolean | null
          includes_vehicles: boolean | null
          is_active: boolean | null
          max_reservations: number | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          includes_charging?: boolean | null
          includes_parking?: boolean | null
          includes_revision?: boolean | null
          includes_vehicles?: boolean | null
          is_active?: boolean | null
          max_reservations?: number | null
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          includes_charging?: boolean | null
          includes_parking?: boolean | null
          includes_revision?: boolean | null
          includes_vehicles?: boolean | null
          is_active?: boolean | null
          max_reservations?: number | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          payment_status: string | null
          plan_id: string
          start_date: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          plan_id: string
          start_date?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          plan_id?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_status: "open" | "assigned" | "in_progress" | "resolved"
      app_role: "client" | "worker" | "admin"
      reservation_status: "pending" | "confirmed" | "completed" | "cancelled"
      resource_type:
        | "parking"
        | "charging_station"
        | "revision_space"
        | "electric_vehicle"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_status: ["open", "assigned", "in_progress", "resolved"],
      app_role: ["client", "worker", "admin"],
      reservation_status: ["pending", "confirmed", "completed", "cancelled"],
      resource_type: [
        "parking",
        "charging_station",
        "revision_space",
        "electric_vehicle",
      ],
    },
  },
} as const
