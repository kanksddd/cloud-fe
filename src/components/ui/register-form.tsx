import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    const newUser = { email, username, password }

    const existing = JSON.parse(localStorage.getItem("users") || "[]")
    const updated = [...existing, newUser]
    localStorage.setItem("users", JSON.stringify(updated))

    alert("✅ Registered! Now you can login.")
    setEmail("")
    setUsername("")
    setPassword("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </CardContent>
    </Card>
  )
}
