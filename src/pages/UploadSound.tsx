import { useState } from "react"
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

export default function UploadSound() {
  const [soundName, setSoundName] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)

  const navigate = useNavigate()

  async function handleUpload() {
    if (!soundName || !image || !audio) {
      alert("Please fill in all fields")
      return
    }
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    if (!loggedInUser.id) {
      alert("You must be logged in to upload.")
      return
    }

    const formData = new FormData()
     formData.append("user_id", loggedInUser.id) 
     formData.append("image", image)
     formData.append("sound_name", soundName)
     formData.append("sound", audio)

     try {
      const response = await fetch("http://localhost:8000/sound_board/sounds", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Upload failed")
      }
      const result = await response.json()
       console.log("Upload success:", result)
       navigate("/home")
     } catch (error) {
       alert("Error: " + error)
    }

    
  }

  return (
    <>
      <NavBar/>
      <div className="min-h-screen bg-gradient-to-b from-pink-300 via-purple-400 to-indigo-500 text-white flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-xl bg-white/50 backdrop-blur-md text-white p-6 shadow-xl rounded-2xl border border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold tracking-wide">
          Upload a Sound 🎵
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Sound Name</Label>
          <Input
            value={soundName}
            onChange={(e) => setSoundName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Picture (jpg/png)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Sound File (mp3)</Label>
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button onClick={handleUpload}>Upload</Button>
      </CardFooter>
    </Card>
      </div>
    </>
  )
}
