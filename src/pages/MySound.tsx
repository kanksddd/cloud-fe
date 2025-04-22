import NavBar from "../NavBar.tsx"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useVolume } from "@/components/ui/VolumeContext.tsx" 

type Sound = {
  id: number
  title: string
  image: string
  audioUrl: string
  user_id: number
  description: string
  visibility: string
}

export default function MySound() {
  const [mySounds, setMySounds] = useState<Sound[]>([])
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const { volume } = useVolume()
  const navigate = useNavigate()  
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser")
    
    if (!loggedIn) {
      navigate("/Login")
      return
    }
    const user = JSON.parse(loggedIn)

    fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds/user", {
      method: "POST",
      body: JSON.stringify({ username: user.username, session: user.session }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if(data["success"] !== true) {
          console.error("Failed to fetch sounds:", data)
          return
        }
        data = data["sounds"]

        const mapped = data
          .map((item: any) => ({
            id: item.soundid,
            title: item.name,
            upload_date: item.upload_date,
            image: item.picture_url,
            audioUrl: item.sound_url,
            user_id: item.owner,
            visibility: item.visibility,
          }))
        setMySounds(mapped)
      })
      .catch(console.error)
  }, [navigate])

  function playSound(url: string) {
    if (currentAudio) currentAudio.pause()
    const audio = new Audio(url)
    audio.volume = volume
    console.log("🔊 Playing with volume:", volume)
    setCurrentAudio(audio)
    audio.play()
  }

  function deleteSound(id: number) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    if (!loggedInUser.username || !loggedInUser.session) {
      alert("You must be logged in to upload.")
      return
    }

    fetch(`https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds/`, {
      method: "DELETE",
      body: JSON.stringify({ sound: id, session: loggedInUser.session, username: loggedInUser.username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          const updated = mySounds.filter((sound) => sound.id !== id)
          setMySounds(updated)
        } else {
          console.error("Failed to delete from server.")
        }
      })
      .catch((err) => {
        console.error("Error deleting sound:", err)
      })
  }
  
  function updateSoundTitle(id: number) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    if (!loggedInUser.username || !loggedInUser.session) {
      alert("You must be logged in to upload.")
      return
    }
    if (!newTitle) {
      alert("Please enter a new title")
      return
    }
    if (newTitle.length > 20) {
      alert("Title must be less than 20 characters")
      return
    }
    if (newTitle.length < 3) {
      alert("Title must be more than 3 characters")
      return
    }
    if (newTitle === mySounds.find((sound) => sound.id === id)?.title) {
      alert("Title is the same as before")
      return
    }
    if (newTitle === "") {
      alert("Please enter a new title")
      return
    }

    fetch(`https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds/`, {
      method: "PATCH",
      body: JSON.stringify({ sound: id, soundname: newTitle, session: loggedInUser.session, username: loggedInUser.username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update sound name")
        return res.json()
      })
      .then(() => {
        setMySounds((prev) =>
          prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
        )
        setEditId(null)
        setNewTitle("")
      })
      .catch(console.error)
  }

  function toggleVisibility(id: number, current: string) {
    const newVisibility = current === "public" ? "private" : "public"
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
    if (!loggedInUser.username || !loggedInUser.session) {
      alert("You must be logged in to upload.")
      return
    }

    fetch(`https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds/`, {
      method: "PATCH",
      body: JSON.stringify({ sound: id, visibility: newVisibility, session: loggedInUser.session, username: loggedInUser.username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setMySounds((prev) =>
          prev.map((s) => s.id === id ? { ...s, visibility: newVisibility } : s)
        )
      })
      .catch(console.error)
  }

  useEffect(() => {
    if (currentAudio) {
      currentAudio.volume = volume
    }
  }, [volume, currentAudio])

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-[#0d0f2b] via-[#1b1b1b] to-[#0a0a0a] text-white">
      <div className="pt-28 px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
          {mySounds.map((sound) => (
            <Card key={sound.id} className="w-full max-w-xl bg-[#1b1b1b] text-white p-6 shadow-xl rounded-2xl border-3 border-blue-400">
              <CardHeader className="flex flex-col items-center">
                <img src={sound.image} alt="Sound" className="w-24 h-24 rounded-full object-cover shadow-md " />
                {editId === sound.id ? (
                    <div className="flex flex-col gap-2">
                        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="text-center border p-1 rounded"/>
                        <Button size="sm" onClick={() => updateSoundTitle(sound.id)} className="bg-red-500">
                             Save
                        </Button>
                    </div>
                ) : (
                        <CardTitle className="mt-4 text-center text-m font-bold tracking-wide text-white">Name: {sound.title}</CardTitle>
                        
                    )}
                        <CardTitle className="mt-2 text-center text-m font-bold tracking-wide text-white">Visibility: {sound.visibility}</CardTitle>
                        <CardTitle className="mt-2 text-center text-m font-bold tracking-wide text-white">Owner: {sound.user_id}</CardTitle>
                        <CardTitle className="mt-2 text-center text-m font-bold tracking-wide text-white">Upload Date: {sound.upload_date}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => playSound(sound.audioUrl)} className="bg-blue-400" >Play</Button>
                        <Button onClick={() => deleteSound(sound.id)} className="ml-2 bg-red-500" >Delete</Button>
                        <Button onClick={() => { setEditId(sound.id); setNewTitle(sound.title) }} className="ml-2 bg-blue-400">Edit</Button>
                        <Button
                          onClick={() => toggleVisibility(sound.id, sound.visibility)}
                          className="ml-2 bg-yellow-500"
                        >
                        {sound.visibility === "public" ? "Make Private" : "Make Public"}
                         </Button>
                    </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </>
  )
}
