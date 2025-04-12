import NavBar from "../NavBar.tsx"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

type Sound = {
    id: number
    title: string
    description: string
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
  }, [])

  function playSound(url: string) {
    if (currentAudio) currentAudio.pause()
    const audio = new Audio(url)
    setCurrentAudio(audio)
    audio.play()
  }
  function deleteSound(id: number) {
    const updated = soundList.filter((sound) => sound.id !== id)
    setSoundList(updated)
    localStorage.setItem("soundList", JSON.stringify(updated))
  }
    return (
        <>
            <NavBar/>
            <div className="flex justify-center items-center py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {soundList.map((sound) => (
                    <Card key={sound.id} className="w-72 p-4 text-center">
                        <CardHeader>
                        <img src={sound.image} alt="Sound" className="w-20 h-20 mx-auto rounded-full object-cover" />
                        <CardTitle className="mt-2 text-xl">{sound.title}</CardTitle>
                        <CardDescription>{sound.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => playSound(sound.audioUrl)}>▶️ Play</Button>
                            <Button onClick={() => deleteSound(sound.id)}>Delete</Button>
                        </CardContent>
            </Card>
            ))}
            
            </div>
            </div>
        </>
    )
}
  