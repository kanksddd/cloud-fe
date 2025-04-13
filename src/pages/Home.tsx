import NavBar from "../NavBar.tsx"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

type Sound = {
    id: number
    title: string
    image: string 
    audioUrl: string
  }

export default function Home() {
    const [soundList, setSoundList] = useState<Sound[]>([])
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
 
     useEffect(() => {
     const stored = localStorage.getItem("soundList")
     if (stored) {
       setSoundList(JSON.parse(stored))
     }
       fetch("http://localhost:8000/sound_board/sounds/all")
       .then((res) => res.json())
       .then((data) => {
         const transformed = data.map((item: any) => ({
           id: item.id,
           title: item.sound_name,
           description: `Uploaded on ${new Date(item.upload_date).toLocaleDateString()}`,
           image: item.image_url || "/vite.svg", 
           audioUrl: `http://localhost:8000/sound_board/sounds/${item.id}`,
         }))
         setSoundList(transformed)
       })
       .catch(console.error)
   }, [])

  function playSound(url: string) {
    if (currentAudio) currentAudio.pause()
    const audio = new Audio(url)
    setCurrentAudio(audio)
    audio.play()
  }
  // function deleteSound(id: number) {
  //   fetch(`http://localhost:8000/sound_board/sounds/${id}`, {
  //     method: "DELETE",
  //   })
  //     .then((res) => {
  //       if (res.ok) {
  //         const updated = soundList.filter((sound) => sound.id !== id)
  //         setSoundList(updated)
  //         localStorage.setItem("soundList", JSON.stringify(updated))
  //       } else {
  //         console.error("Failed to delete from server.")
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error deleting sound:", err)
  //     })
  // }
  
    return (
        <>
                 
            <NavBar/>
            <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 text-white">
            <div className="py-16 px-8"> 
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
            
                {soundList.map((sound) => (
                    <Card key={sound.id} className="w-full max-w-xl bg-white/70 backdrop-blur-md text-white p-6 shadow-xl rounded-2xl border border-white/20">
                        <CardHeader className="justify-center">
                        <img src={sound.image} alt="Sound" className="w-24 h-24 rounded-full object-cover shadow-md " />
                        <CardTitle className="mt-4 text-center text-xl font-bold tracking-wide">{sound.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button onClick={() => playSound(sound.audioUrl)}>▶️ Play</Button>
                            {/* <Button onClick={() => deleteSound(sound.id)}>Delete</Button> */}
                        </CardContent>
            </Card>
            ))}
            
            </div>
            </div>
            </div> 
            
        </>
    )
}
  