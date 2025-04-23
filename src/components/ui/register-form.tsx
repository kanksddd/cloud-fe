// register-form.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function RegisterForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm_pass, setConfirmPass] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (password !== confirm_pass) {
        setError("Passwords do not match.")
        return
      }
    
      const res = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
    
      const data = await res.json()
    
      // Check for HTTP error OR backend logic failure
      if (!res.ok || data.success === false) {
        const message = data?.message || data?.detail || "Unknown error occurred"
        throw new Error(message)
      }
    
      // Check for success
      setError("")
      setMessage("✅ Registered! You can now login.")
      setUsername("")
      setPassword("")
      setConfirmPass("")

    } catch (err: any) {
      console.log(err.message)
      setError("❌ " + err.message)
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
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border-blue-400 text-white"/>
          </div>
          <div  className="grid gap-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input id="confirm_pass" type="password" value={confirm_pass} onChange={(e) => setConfirmPass(e.target.value)} required className="border-blue-400 text-white"/>
          </div>
          <Button type="submit" className="w-full grid gap-2 bg-blue-400 hover:bg-black">Register</Button>
        </form>
        {message && <p className="text-green-500 text-center mt-4">{message}</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </CardContent>
    </Card>
  )
}