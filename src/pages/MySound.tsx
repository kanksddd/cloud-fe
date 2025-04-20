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

}

export default function MySound() {
  const [mySounds, setMySounds] = useState<Sound[]>([])
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const navigate = useNavigate()
  const [editId, setEditId] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const { volume } = useVolume()

  useEffect(() => {
    
    const loggedIn = localStorage.getItem("loggedInUser")
    
    if (!loggedIn) {
      navigate("/Login")
      return
    }

    const user = JSON.parse(loggedIn)
    const userId = user.id

    fetch("http://localhost:8000/sound_board/sounds/all")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((item: any) => parseInt(item.user_id) === userId)

          .map((item: any) => ({
            id: item.id,
            title: item.sound_name,
            description: `Uploaded on ${new Date(item.upload_date).toLocaleDateString()}`,
            image: item.image_url || "/vite.svg",
            audioUrl: `http://localhost:8000/sound_board/sounds/${item.id}`,
            user_id: item.user_id,
          }))
        setMySounds(filtered)
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
    fetch(`http://localhost:8000/sound_board/sounds/${id}`, {
      method: "DELETE",
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
    const formData = new FormData()
    formData.append("sound_name", newTitle)
  
    fetch(`http://localhost:8000/sound_board/sounds/${id}`, {
      method: "PATCH",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update sound name")
        return res.json()
      })
      .then((updated) => {
        setMySounds((prev) =>
          prev.map((s) => (s.id === id ? { ...s, title: updated.sound_name } : s))
        )
        setEditId(null)
        setNewTitle("")
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
                        <CardTitle className="mt-2 text-center text-m font-bold tracking-wide text-white">Date: {sound.description}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => playSound(sound.audioUrl)} className="bg-blue-400" >Play</Button>
                        <Button onClick={() => deleteSound(sound.id)} className="ml-2 bg-red-500" >Delete</Button>
                        <Button onClick={() => { setEditId(sound.id); setNewTitle(sound.title) }} className="ml-2 bg-blue-400">Edit</Button>
                    </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </>
  )
}
