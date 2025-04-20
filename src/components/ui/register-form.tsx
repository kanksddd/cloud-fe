import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        body: new URLSearchParams({ username, email, password }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail)
      }

      alert("✅ Registered! You can now login.")
      setEmail("")
      setUsername("")
      setPassword("")
    } catch (err: any) {
      alert("❌ " + err.message)
    }
  }

  return (
    <Card className="w-full max-w-xl bg-[#1b1b1b] text-white p-6 shadow-xl rounded-2xl border-3 border-blue-400">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div  className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="border-blue-400 text-white"/>
          </div>
          <div  className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-blue-400 text-white"/>
          </div>
          <div  className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border-blue-400 text-white"/>
          </div>
          <Button type="submit" className="w-full grid gap-2 bg-blue-400 hover:bg-black">Register</Button>
        </form>
      </CardContent>
    </Card>
  )
}
