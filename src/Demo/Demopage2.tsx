import { useEffect, useRef, useState } from "react"

const LAMBDA_URL = "https://oazmsesxjpxe42vbgdi7jv3gaa0tapzx.lambda-url.ap-southeast-1.on.aws/"  // ← update this!
const APPSYNC_API_ID = "nuzqyia5afgtldjifvnfcl5gum"
const REGION = "ap-southeast-1"
const GRAPHQL_API_HOST = `${APPSYNC_API_ID}.appsync-api.${REGION}.amazonaws.com`
const WSS_ENDPOINT = `wss://${APPSYNC_API_ID}.appsync-realtime-api.${REGION}.amazonaws.com/graphql`
const API_KEY = "da2-rcqb53kctbh3rb3ecl6pwnbwby"

function toBase64Header(obj: Record<string, any>): string {
  const json = JSON.stringify(obj)
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export default function Demopage2() {
  const [messages, setMessages] = useState<any[]>([])
  const socketRef = useRef<WebSocket | null>(null)

  // 🔄 Load existing items from Lambda on first render
  useEffect(() => {
    fetch(LAMBDA_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data)
        } else {
          console.error("Expected array, got:", data)
          setMessages([])  // fallback to empty array
        }
      })
      .catch(err => {
        console.error("Failed to load messages:", err)
        setMessages([])  // prevent crash on error
      })
  }, [])
  

  // 🔌 Setup WebSocket Subscription
  useEffect(() => {
    const headerBase64 = toBase64Header({
      host: GRAPHQL_API_HOST,
      "x-api-key": API_KEY
    })

    const socket = new WebSocket(WSS_ENDPOINT, [
      "graphql-ws",
      `header-${headerBase64}`
    ])
    socketRef.current = socket

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "connection_init" }))
    }

    socket.onmessage = ({ data }) => {
      const msg = JSON.parse(data)
      switch (msg.type) {
        case "connection_ack":
          startSubscription(socket)
          break
        case "data":
          const newText = msg.payload.data.onTextAdded
          setMessages(prev => {
            const exists = prev.some(item => item.id === newText.id)
            if (exists) return prev
            return [newText, ...prev]
          })
          break
        case "error":
          console.error("[WS] error:", msg.payload)
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

  function startSubscription(socket: WebSocket) {
    socket.send(JSON.stringify({
      id: "1",
      type: "start",
      payload: {
        data: JSON.stringify({
          query: `
            subscription OnTextAdded {
              onTextAdded {
                id
                text
                createdAt
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
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📱 Live Text Feed</h1>
      {messages.map(msg => (
        <div key={msg.id} className="p-2 border mb-2 rounded">
          <p>{msg.text}</p>
          <small>{new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      ))}
      {messages.length === 0 && <p>No messages yet.</p>}
    </div>
  )
}
