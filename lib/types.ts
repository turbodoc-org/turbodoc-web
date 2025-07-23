export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  time_added: number;
  tags: string | null;
  status: "read" | "unread" | "archived";
  created_at: string | null;
  updated_at: string | null;
  ogImage?: string | null;
}

export interface BookmarkResponse {
  data: Bookmark[];
}

export interface BookmarkSearchResponse {
  data: Bookmark[];
  query: string;
}

export interface OgImageResponse {
  ogImage: string | null;
  title: string | null;
}
