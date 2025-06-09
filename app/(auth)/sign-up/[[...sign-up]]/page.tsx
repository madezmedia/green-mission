import { SignUp } from "@clerk/nextjs"
import { signUpConfig } from "@/lib/auth/clerk-config"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Join Green Mission</h1>
          <p className="text-white/80">Create your account and start connecting with sustainable businesses</p>
        </div>
        <SignUp {...signUpConfig} />
      </div>
    </div>
  )
}
