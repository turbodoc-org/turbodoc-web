import { SignUpForm } from "@/components/sign-up-form";
import { Logo } from "@/components/logo";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="lg" href="/" />
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
