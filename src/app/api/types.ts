export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiAttachment {
  id?: string;
  event_id?: string;
  name: string;
  url: string;
  sort_order?: number;
}

export interface ApiEventListItem {
  id: string;
  title: string;
  date: string;
  date_end: string | null;
  time: string;
  time_end: string | null;
  description: string;
  long_description?: string;
  category: string;
  secondary_filter: string | null;
  is_important: number | boolean;
  image_url: string | null;
  location: string;
  location_map_url: string;
  published?: number | boolean;
  slug: string | null;
  created_at?: string;
  updated_at?: string;
  attachments?: ApiAttachment[];
}

export interface ApiCategory {
  id: number;
  name: string;
  color_hex: string;
  sort_order: number;
}

export interface ApiAdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface EventsQueryParams {
  category?: string;
  important?: boolean;
  from?: string;
}
