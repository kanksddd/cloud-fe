import NavBar from "../NavBar.tsx"
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useVolume } from "@/components/ui/VolumeContext.tsx" 

type Sound = {
    id: number
    title: string
    image: string 
    audioUrl: string
    description: string
  }

export default function Home() {
    const [soundList, setSoundList] = useState<Sound[]>([])
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
    const { volume } = useVolume()
 
     useEffect(() => {
      

       fetch("http://localhost:8000/sound_board/sounds/all") 
       .then((res) => res.json())
       .then((data) => {
         const transformed = data.map((item: any) => ({
           id: item.id,
           title: item.sound_name,
           description: `Uploaded on ${new Date(item.upload_date).toLocaleDateString()}`,
           image: item.image_url , 
           audioUrl: `http://localhost:8000/sound_board/sounds/${item.id}`, 
         }))
         setSoundList(transformed)
       })
       .catch(console.error)
   }, [])

   function playSound(url: string) {
    if (currentAudio) currentAudio.pause()
    const audio = new Audio(url)
    audio.volume = volume
    console.log("🔊 Playing with volume:", volume)
    setCurrentAudio(audio)
    audio.play()
  }

  useEffect(() => {
    if (currentAudio) {
      currentAudio.volume = volume
    }
  }, [volume, currentAudio])
  
    return (
        <>
                 
            <NavBar/>
            <div className="min-h-screen bg-gradient-to-br from-[#0d0f2b] via-[#1b1b1b] to-[#0a0a0a] text-white">
            <div className="pt-28 px-8"> 
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
            
                {soundList.map((sound) => (
                    <Card key={sound.id} className="w-full max-w-xl bg-[#1b1b1b] text-white p-6 shadow-xl rounded-2xl border-3 border-blue-400">
                        <CardHeader className="flex flex-col items-center">
                        <img src={sound.image} alt="Sound" className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-blue-400 " />
                        <CardTitle className="mt-4 text-center text-m font-medium tracking-wide text-white">Name: {sound.title}</CardTitle>
                        <CardTitle className="mt-2 text-center text-m font-medium tracking-wide text-white">Date: {sound.description}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button onClick={() => playSound(sound.audioUrl)} className="bg-blue-400">Play</Button>
                        </CardContent>
            </Card>
            ))}
            
            </div>
            </div>
            </div> 
            
        </>
    )
}
  