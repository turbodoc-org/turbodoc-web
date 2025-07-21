import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-2 md:gap-4 text-foreground text-sm md:text-base">
      <span className="hidden sm:inline">Hey, {user.email}!</span>
      <span className="sm:hidden">Hi!</span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-1 md:gap-2">
      <Button
        asChild
        size="sm"
        variant={"outline"}
        className="text-xs md:text-sm"
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button
        asChild
        size="sm"
        variant={"default"}
        className="text-xs md:text-sm"
      >
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
