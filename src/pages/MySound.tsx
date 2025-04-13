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

type Sound = {
  id: number
  title: string
  image: string
  audioUrl: string
  user_id: number

}

export default function MySound() {
  const [mySounds, setMySounds] = useState<Sound[]>([])
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const navigate = useNavigate()
  const [editId, setEditId] = useState<number | null>(null)
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedInUser")
    
    if (!loggedIn) {
      navigate("/login")
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


  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-pink-300 via-purple-400 to-indigo-500 text-white">
      <div className="flex justify-center items-center py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mySounds.map((sound) => (
            <Card key={sound.id} className="w-full max-w-xl bg-white/70 backdrop-blur-md text-white p-6 shadow-xl rounded-2xl border border-white/20">
              <CardHeader>
                <img src={sound.image} alt="Sound" className="w-20 h-20 mx-auto rounded-full object-cover" />
                {editId === sound.id ? (
                    <div className="flex flex-col gap-2">
                        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="text-center border p-1 rounded"/>
                        <Button size="sm" onClick={() => updateSoundTitle(sound.id)}>
                             Save
                        </Button>
                    </div>
                ) : (
                        <CardTitle className="mt-2 text-xl">{sound.title}</CardTitle>
                    )}
                
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => playSound(sound.audioUrl)}>Play</Button>
                        <Button onClick={() => deleteSound(sound.id)} className="ml-2">Delete</Button>
                        <Button onClick={() => { setEditId(sound.id); setNewTitle(sound.title) }} className="ml-2">Edit</Button>
                    </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </>
  )
}
