import { SignIn } from "@clerk/nextjs"
import { signInConfig } from "@/lib/auth/clerk-config"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80">Sign in to your Green Mission account</p>
        </div>
        <SignIn {...signInConfig} />
      </div>
    </div>
  )
}
