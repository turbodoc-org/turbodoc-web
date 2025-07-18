import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Logo } from "@/components/logo";

export const runtime = "edge";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-amber-50/50 to-orange-50/30">
      <nav className="sticky top-0 z-50 w-full bg-yellow-50/90 backdrop-blur-lg border-b border-yellow-200/40 shadow-sm">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center p-4 px-6">
          <div className="flex items-center gap-6">
            <Logo size="md" />
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full max-w-7xl mx-auto p-6 pt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-black">My Bookmarks</h1>
          </div>
          <p className="text-black/70 text-sm">
            Save, organize, and access your favorite links from anywhere
          </p>
        </div>

        <div className="relative">
          <BookmarkGrid />
        </div>
      </div>
    </main>
  );
}
