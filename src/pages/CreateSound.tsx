import { useEffect, useState } from "react"
import NavBar from "../NavBar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function CreateSound() {
  const [text, setText] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser")
    if (!loggedIn) {
      navigate("/Login")
    }
  }, [navigate])

  async function handleCreate() {
    if (!text) {
      alert("Please enter text")
      return
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    if (!loggedInUser.id) {
      alert("You must be logged in to create.")
      return
    }

    const formData = new FormData()
    formData.append("user_id", loggedInUser.id)
    formData.append("text", text)

    try {
      const response = await fetch("http://localhost:8000/sound_board/create_text", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Creation failed")
      }

      const result = await response.json()
      console.log("✅ Created:", result)
      navigate("/home")
    } catch (error) {
      alert("❌ " + error)
    }
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-[#0d0f2b] via-[#1b1b1b] to-[#0a0a0a] text-white flex items-center justify-center ">
        <Card className="w-full max-w-xl bg-[#1b1b1b] text-white p-6 shadow-xl rounded-2xl border-3 border-blue-400">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold tracking-wide text-white">
              Create Sound From Text 
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-white">
            <div>
              <Label>Please Enter Text</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something to turn into sound..."
                className="mt-2 border-blue-400 text-white placeholder-white"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button onClick={handleCreate} className="bg-blue-400">Create</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
