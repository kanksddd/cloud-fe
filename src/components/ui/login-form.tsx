import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-xl bg-[#1b1b1b] text-white p-6 shadow-xl rounded-2xl border-3 border-blue-400">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold tracking-wide">Login</CardTitle>
          
        </CardHeader>
        <CardContent>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const username = (e.target as any).username.value
            const password = (e.target as any).password.value

            try {
              const res = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/auth/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
              })
            
              if (!res.ok) {
                const error = await res.json()
                throw new Error(error.detail)
              }
            
              const user = await res.json()
              localStorage.setItem("loggedInUser", JSON.stringify(user))
              window.location.href = "/Home"
            } catch (err: any) {
              alert("❌ " + err.message)
            }
          }}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="username" required className="border-blue-400 text-white" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required className="border-blue-400 text-white" />
              </div>
              <Button type="submit" className="w-full bg-blue-400 hover:bg-black">Login</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
