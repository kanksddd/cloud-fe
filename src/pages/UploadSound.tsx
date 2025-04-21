import { useState, useEffect } from "react"
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
  const [visibility] = useState("private")

  const navigate = useNavigate()
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser")
    if (!loggedIn) {
      navigate("/Login")
    }
  }, [navigate])

  // async function handleUpload() {
  //   if (!soundName || !image || !audio) {
  //     alert("Please fill in all fields")
  //     return
  //   }
  //   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
  //   if (!loggedInUser.id) {
  //     alert("You must be logged in to upload.")
  //     return
  //   }

    // const formData = new FormData()
    //  formData.append("user_id", loggedInUser.id) 
    //  formData.append("image", image)
    //  formData.append("sound_name", soundName)
    //  formData.append("sound", audio)
    //  formData.append("visibility", visibility)

  //    try {
  //     // === 1. Get upload URL for image ===
  //     const imgRes = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ filetype: image.type }) 
  //     })
  //     const { url: imgUrl, key: imageKey } = await imgRes.json()
  
  //     await fetch(imgUrl, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": image.type
  //       },
  //       body: image
  //     })

  //     const audioRes = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ filetype: audio.type }) 
  //     })
  //     const { url: audioUrl, key: soundKey } = await audioRes.json()
  
  //     await fetch(audioUrl, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": audio.type
  //       },
  //       body: audio
  //     })

  //     const saveRes = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user_id: loggedInUser.id,
  //         sound_name: soundName,
  //         visibility,
  //         image_url: imageKey, 
  //         sound_url: soundKey,
  //       })
  //     })
  
  //     if (!saveRes.ok) {
  //       const err = await saveRes.json()
  //       throw new Error(err.detail || "Failed to save sound info")
  //     }
  
  //     console.log("Upload success")
  //     navigate("/Home")
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       alert("Error: " + error.message)
  //     } else {
  //       alert("Error: " + JSON.stringify(error))
  //     }
  //   }
  // }

  async function handleUpload() {
    if (!soundName || !image || !audio) {
      alert("Please fill in all fields")
      return
    }
  
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    if (!loggedInUser.username || !loggedInUser.session) {
      alert("You must be logged in to upload.")
      return
    }
  
    // Extract file extensions
    const imageExtension = image.name.split('.').pop()
    const audioExtension = audio.name.split('.').pop()
  
    const picturefile = `image.${imageExtension}`
    const soundfile = `${soundName}.${audioExtension}`
  
    try {
      // STEP 1: Request upload URLs from backend
      const presignRes = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loggedInUser.username,
          session: loggedInUser.session,
          soundfile,
          picturefile,
          visibility  
        })
      })
  
      if (!presignRes.ok) {
        const err = await presignRes.json()
        throw new Error(err.detail || "Failed to get upload URLs")
      }
  
      const { sound_upload_url, picture_upload_url } = await presignRes.json()
  
      // STEP 2: Upload files to pre-signed URLs
      await Promise.all([
        fetch(picture_upload_url, {
          method: "PUT",
          headers: { "Content-Type": image.type },
          body: image
        }),
        fetch(sound_upload_url, {
          method: "PUT",
          headers: { "Content-Type": audio.type },
          body: audio
        })
      ])
  
      console.log("✅ Upload complete")
      navigate("/Home")
    } catch (error) {
      alert("❌ Upload failed: " + (error instanceof Error ? error.message : JSON.stringify(error)))
    }
  }
  
  
      // 🔥 Send exact format required by your backend
      // const response = await fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     username: loggedInUser.username,
      //     session: loggedInUser.session,
      //     soundfile: soundKey,
      //     picturefile: imageKey,
      //     visibility 
      //   })
      // })
  
  //     if (!response.ok) {
  //       const err = await response.json()
  //       throw new Error(err.detail || "❌ Failed to save sound info")
  //     }
  
  //     console.log("✅ Uploaded successfully")
  //     navigate("/Home")
  //   } catch (error) {
  //     alert("❌ Upload failed: " + (error instanceof Error ? error.message : JSON.stringify(error)))
  //   }
  // }
  


  return (
    <>
      <NavBar/>
      <div className="min-h-screen bg-gradient-to-br from-[#0d0f2b] via-[#1b1b1b] to-[#0a0a0a] text-white flex items-center justify-center ">
      <Card className="w-full max-w-xl bg-[#1b1b1b] text-white p-6 shadow-xl rounded-2xl border-3 border-blue-400 ">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold tracking-wide text-white">
          Upload the Sound 
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-white">
        <div>
          <Label>Sound Name</Label>
          <Input
            value={soundName}
            onChange={(e) => setSoundName(e.target.value)}
            className="mt-2 border-blue-400 text-white placeholder-white"
          />
        </div>

        <div>
          <Label>Picture (jpg/png)</Label>
          <Input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="mt-2 border-blue-400 text-white placeholder-white"
          />
        </div>

        <div>
          <Label>Sound File (mp3/wav)</Label>
          <Input
            type="file"
            accept=".mp3,.wav"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            className="mt-2 border-blue-400 text-white placeholder-white"
          />
        </div>

        
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button onClick={handleUpload} className="bg-blue-400 hover:bg-black">Upload</Button>
      </CardFooter>
    </Card>
      </div>
    </>
  )
}
