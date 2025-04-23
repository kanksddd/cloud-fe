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
  const [soundname, setName] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser")
    if (!loggedIn) {
      navigate("/Login")
    }
  }, [navigate])

  async function handleCreate() {
    if (!text || !image) {
      alert("Please fill in all fields")
      return
    }
    

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    if (!loggedInUser.session) {
      alert("You must be logged in to create.")
      return
    }

    // Extract file extensions
    const imageExtension = image.name.split('.').pop()
    const picturefile = `image.${imageExtension}`


    try {
      const response = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds/create", {
        method: "POST",
        body: JSON.stringify({
          username: loggedInUser.username,
          session: loggedInUser.session,
          soundtext: text,
          soundname: soundname,
          picturefile
        }),
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to create sound or get URLs")
      }

      const { picture_upload_url } = await response.json()

      await Promise.all([
        fetch(picture_upload_url, {
          method: "PUT",
          headers: { "Content-Type": image.type },
          body: image
        })
      ])

      console.log("✅ Upload and creation completed")
      navigate("/MySound")
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
              <Label>Sound Name</Label>
              <Input
                value={soundname}
                onChange={(e) => setName(e.target.value)}
                placeholder="What do you want to call this sound?"
                className="mt-2 border-blue-400 text-white placeholder-white"
              />
            </div>
          </CardContent>

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

          <div>
            <Label>Picture (jpg/png)</Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-2 border-blue-400 text-white placeholder-white"
            />
          </div>

          <CardFooter className="flex justify-center">
            <Button onClick={handleCreate} className="bg-blue-400">Create</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}