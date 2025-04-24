export interface User {
  id: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_favorited: boolean;
}