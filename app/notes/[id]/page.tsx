import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteEditor } from "@/components/note-editor";

export const runtime = "edge";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <NoteEditor noteId={id} />;
}
