import { createClient } from "@/lib/supabase/client";
import { Bookmark, BookmarkResponse, OgImageResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.turbodoc.ai";

export async function getBookmarks(): Promise<Bookmark[]> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const response = await fetch(`${API_BASE_URL}/v1/bookmarks`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookmarks");
  }

  const result: BookmarkResponse = await response.json();
  return result.data;
}

export async function getOgImage(url: string): Promise<OgImageResponse> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/bookmarks/og-image?url=${encodeURIComponent(url)}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    return { ogImage: null, title: null };
  }

  return await response.json();
}

export async function deleteBookmark(id: string): Promise<void> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const response = await fetch(`${API_BASE_URL}/v1/bookmarks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete bookmark");
  }
}

export async function updateBookmark(
  id: string,
  updates: Partial<Bookmark>,
): Promise<Bookmark> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const response = await fetch(`${API_BASE_URL}/v1/bookmarks/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update bookmark");
  }

  const result = await response.json();
  return result.data;
}

export async function createBookmark(bookmark: {
  title: string;
  url: string;
  tags?: string;
  status?: string;
}): Promise<Bookmark> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No session found");
  }

  const response = await fetch(`${API_BASE_URL}/v1/bookmarks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookmark),
  });

  if (!response.ok) {
    throw new Error("Failed to create bookmark");
  }

  const result = await response.json();
  return result.data;
}
