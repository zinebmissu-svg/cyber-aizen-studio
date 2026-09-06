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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string
          created_at: string
          deleted_at: string | null
          id: string
          kind: string
          mime_type: string | null
          provider: string
          size_bytes: number | null
          storage_path: string | null
          tags: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string
          visible: boolean
        }
        Insert: {
          alt?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind?: string
          mime_type?: string | null
          provider?: string
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url: string
          visible?: boolean
        }
        Update: {
          alt?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind?: string
          mime_type?: string | null
          provider?: string
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          id: string
          label: string
          link_type: string
          sort_order: number
          target: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          link_type?: string
          sort_order?: number
          target: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          link_type?: string
          sort_order?: number
          target?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      project_media: {
        Row: {
          alt: string
          created_at: string
          id: string
          kind: string
          media_id: string | null
          project_id: string
          provider: string
          sort_order: number
          thumbnail_url: string | null
          updated_at: string
          url: string
          visible: boolean
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          kind?: string
          media_id?: string | null
          project_id: string
          provider?: string
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
          url: string
          visible?: boolean
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          kind?: string
          media_id?: string | null
          project_id?: string
          provider?: string
          sort_order?: number
          thumbnail_url?: string | null
          updated_at?: string
          url?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "project_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          client: string
          cover_alt: string
          cover_url: string | null
          created_at: string
          deleted_at: string | null
          description: string
          featured: boolean
          gradient: string
          id: string
          kind: string
          link_url: string | null
          slug: string | null
          sort_order: number
          status: string
          tags: string[]
          title: string
          updated_at: string
          video_url: string | null
          visible: boolean
          year: string
        }
        Insert: {
          category?: string
          client?: string
          cover_alt?: string
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string
          featured?: boolean
          gradient?: string
          id?: string
          kind?: string
          link_url?: string | null
          slug?: string | null
          sort_order?: number
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
          year?: string
        }
        Update: {
          category?: string
          client?: string
          cover_alt?: string
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string
          featured?: boolean
          gradient?: string
          id?: string
          kind?: string
          link_url?: string | null
          slug?: string | null
          sort_order?: number
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
          year?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          avatar_url: string | null
          company: string
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          quote: string
          rating: number
          role: string
          sort_order: number
          status: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          avatar_url?: string | null
          company?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          quote: string
          rating?: number
          role?: string
          sort_order?: number
          status?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          avatar_url?: string | null
          company?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          quote?: string
          rating?: number
          role?: string
          sort_order?: number
          status?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string
          icon: string
          id: string
          image_url: string | null
          number: string
          sort_order: number
          status: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string
          icon?: string
          id?: string
          image_url?: string | null
          number?: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string
          icon?: string
          id?: string
          image_url?: string | null
          number?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_headline: string
          about_p1: string
          about_p2: string
          animations_enabled: boolean
          base_font_size: string
          brand_name: string
          contact_email: string
          contact_form_button: string
          contact_headline: string
          cursor_color: string
          cursor_enabled: boolean
          draft_json: Json | null
          font_body: string
          font_display: string
          footer_text: string
          hero_cta1_label: string
          hero_cta2_label: string
          hero_eyebrow: string
          hero_image_url: string | null
          hero_line1: string
          hero_line2: string
          hero_line3: string
          hero_subtitle: string
          id: number
          instagram_handle: string
          location_sub: string
          location_text: string
          marquee_text: string
          nav_cta_label: string
          portrait_url: string | null
          radius: string
          reviews_headline: string
          seo_description: string
          seo_og_image: string | null
          seo_title: string
          services_headline: string
          services_json: Json
          shadow_strength: string
          stat1_l: string
          stat1_n: string
          stat2_l: string
          stat2_n: string
          stat3_l: string
          stat3_n: string
          theme_accent: string
          theme_bg: string
          theme_border: string
          theme_button_bg: string
          theme_button_fg: string
          theme_foreground: string
          theme_gradient_from: string
          theme_gradient_to: string
          theme_heading: string
          theme_hover: string
          theme_muted: string
          theme_primary: string
          theme_primary_glow: string
          theme_secondary: string
          timeline_headline: string
          updated_at: string
          whatsapp_number: string
          work_headline: string
          work_subtitle: string
        }
        Insert: {
          about_headline?: string
          about_p1?: string
          about_p2?: string
          animations_enabled?: boolean
          base_font_size?: string
          brand_name?: string
          contact_email?: string
          contact_form_button?: string
          contact_headline?: string
          cursor_color?: string
          cursor_enabled?: boolean
          draft_json?: Json | null
          font_body?: string
          font_display?: string
          footer_text?: string
          hero_cta1_label?: string
          hero_cta2_label?: string
          hero_eyebrow?: string
          hero_image_url?: string | null
          hero_line1?: string
          hero_line2?: string
          hero_line3?: string
          hero_subtitle?: string
          id?: number
          instagram_handle?: string
          location_sub?: string
          location_text?: string
          marquee_text?: string
          nav_cta_label?: string
          portrait_url?: string | null
          radius?: string
          reviews_headline?: string
          seo_description?: string
          seo_og_image?: string | null
          seo_title?: string
          services_headline?: string
          services_json?: Json
          shadow_strength?: string
          stat1_l?: string
          stat1_n?: string
          stat2_l?: string
          stat2_n?: string
          stat3_l?: string
          stat3_n?: string
          theme_accent?: string
          theme_bg?: string
          theme_border?: string
          theme_button_bg?: string
          theme_button_fg?: string
          theme_foreground?: string
          theme_gradient_from?: string
          theme_gradient_to?: string
          theme_heading?: string
          theme_hover?: string
          theme_muted?: string
          theme_primary?: string
          theme_primary_glow?: string
          theme_secondary?: string
          timeline_headline?: string
          updated_at?: string
          whatsapp_number?: string
          work_headline?: string
          work_subtitle?: string
        }
        Update: {
          about_headline?: string
          about_p1?: string
          about_p2?: string
          animations_enabled?: boolean
          base_font_size?: string
          brand_name?: string
          contact_email?: string
          contact_form_button?: string
          contact_headline?: string
          cursor_color?: string
          cursor_enabled?: boolean
          draft_json?: Json | null
          font_body?: string
          font_display?: string
          footer_text?: string
          hero_cta1_label?: string
          hero_cta2_label?: string
          hero_eyebrow?: string
          hero_image_url?: string | null
          hero_line1?: string
          hero_line2?: string
          hero_line3?: string
          hero_subtitle?: string
          id?: number
          instagram_handle?: string
          location_sub?: string
          location_text?: string
          marquee_text?: string
          nav_cta_label?: string
          portrait_url?: string | null
          radius?: string
          reviews_headline?: string
          seo_description?: string
          seo_og_image?: string | null
          seo_title?: string
          services_headline?: string
          services_json?: Json
          shadow_strength?: string
          stat1_l?: string
          stat1_n?: string
          stat2_l?: string
          stat2_n?: string
          stat3_l?: string
          stat3_n?: string
          theme_accent?: string
          theme_bg?: string
          theme_border?: string
          theme_button_bg?: string
          theme_button_fg?: string
          theme_foreground?: string
          theme_gradient_from?: string
          theme_gradient_to?: string
          theme_heading?: string
          theme_hover?: string
          theme_muted?: string
          theme_primary?: string
          theme_primary_glow?: string
          theme_secondary?: string
          timeline_headline?: string
          updated_at?: string
          whatsapp_number?: string
          work_headline?: string
          work_subtitle?: string
        }
        Relationships: []
      }
      timeline_items: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          sort_order: number
          text: string
          title: string
          updated_at: string
          visible: boolean
          year: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          sort_order?: number
          text?: string
          title: string
          updated_at?: string
          visible?: boolean
          year: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          sort_order?: number
          text?: string
          title?: string
          updated_at?: string
          visible?: boolean
          year?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
