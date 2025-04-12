import { LoginForm } from "@/components/ui/login-form"
import NavBar from "../NavBar.tsx"
import { RegisterForm } from "@/components/ui/register-form.tsx"

export default function Login() {
  return (
    <>
    <NavBar/>
    <div className="flex min-h-svh w-full items-center justify-center gap-10 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
    </>
  )
}
