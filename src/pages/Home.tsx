import NavBar from "../NavBar.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useVolume } from "@/components/ui/VolumeContext.tsx"

const APPSYNC_API_ID = "dbot4ru3fbdhpm2rbk6kluvkme"
const REGION = "ap-southeast-1"
const GRAPHQL_API_HOST = `${APPSYNC_API_ID}.appsync-api.${REGION}.amazonaws.com`
const WSS_ENDPOINT = `wss://${APPSYNC_API_ID}.appsync-realtime-api.${REGION}.amazonaws.com/graphql`
const API_KEY = "da2-rc4ww3iirvafvjo6df7p5s65ta"

function toBase64Header(obj: Record<string, any>): string {
  const json = JSON.stringify(obj)
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export default function Home() {
  const [soundList, setSoundList] = useState<any[]>([])
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const { volume } = useVolume()

  useEffect(() => {
    fetch("https://mdggjbti4b.execute-api.ap-southeast-1.amazonaws.com/dev/soundboard/sounds/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const transformed = data["sounds"]
          .filter((item: any) => item.visibility === "public")
          .map((item: any) => ({
            id: item.soundid,
            title: item.name,
            upload_date: item.upload_date,
            image: item.picture_url,
            audioUrl: item.sound_url,
            user_id: item.owner,
          }))
        setSoundList(transformed)
      })
      .catch(console.error)
  }, [])

  function playSound(url: string) {
    if (currentAudio) currentAudio.pause()
    const audio = new Audio(url)
    audio.volume = volume
    setCurrentAudio(audio)
    audio.play()
  }

  useEffect(() => {
    if (currentAudio) currentAudio.volume = volume
  }, [volume, currentAudio])

  useEffect(() => {
    const headerBase64 = toBase64Header({
      host: GRAPHQL_API_HOST,
      "x-api-key": API_KEY
    })

    const socket = new WebSocket(WSS_ENDPOINT, [
      "graphql-ws",
      `header-${headerBase64}`
    ])

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "connection_init" }))
    }

    socket.onmessage = ({ data }) => {
      const msg = JSON.parse(data)
      switch (msg.type) {
        case "connection_ack":
          socket.send(JSON.stringify({
            id: "1",
            type: "start",
            payload: {
              data: JSON.stringify({
                query: `
                  subscription OnMeeMSoundUpdated {
                    onMeeMSoundUpdated {
                      soundid
                      ownerid
                      key
                      visibility
                      soundinfo
                      ownerinfo
                    }
                  }
                `
              }),
              variables: {},
              extensions: {
                authorization: {
                  host: GRAPHQL_API_HOST,
                  "x-api-key": API_KEY
                }
              }
            }
          }))
          break

        case "data":
          const sound = msg.payload.data.onMeeMSoundUpdated
          const info = JSON.parse(sound.soundinfo)
          const owner = JSON.parse(sound.ownerinfo)
          const newSound = {
            id: sound.soundid,
            title: info.name,
            upload_date: new Date(info.upload_date * 1000).toLocaleString(),
            image: "",
            audioUrl: "",
            user_id: owner.username,
            visibility: sound.visibility
          }

          setSoundList(prev => {
            if (newSound.visibility === "deleted") {
              return prev.filter((s) => s.id !== newSound.id)
            }

            const index = prev.findIndex(s => s.id === newSound.id)
            if (index !== -1) {
              const updated = [...prev]
              updated[index] = { ...updated[index], ...newSound }
              return updated
            }

            if (newSound.visibility === "public") {
              return [...prev, newSound]
            }

            return prev
          })
          break

        case "error":
          console.error("[WebSocket error]", msg.payload)
          break

        default:
          break
      }
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ id: "1", type: "stop" }))
        socket.close()
      }
    }
  }, [])

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-[#0d0f2b] via-[#1b1b1b] to-[#0a0a0a] text-white">
        <div className="pt-28 px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
            {soundList.map((sound) => (
              <Card
                key={sound.id}
                className="w-full max-w-xl bg-[#1b1b1b] text-white p-6 shadow-xl rounded-2xl border-3 border-blue-400"
              >
                <CardHeader className="flex flex-col items-center">
                  <img
                    src={sound.image || "/placeholder.jpg"}
                    alt="Sound"
                    className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-blue-400"
                  />
                  <CardTitle className="text-2xl mt-4 text-center font-bold tracking-wide">
                    {sound.title}
                  </CardTitle>
                  <CardTitle className="mt-2 text-center text-m font-medium tracking-wide text-gray-500">
                    {sound.upload_date}
                  </CardTitle>
                  <CardTitle className="mt-2 text-center text-m font-medium tracking-wide text-gray-500">
                    Owner: {sound.user_id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button onClick={() => playSound(sound.audioUrl)} className="bg-blue-400">
                    Play
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