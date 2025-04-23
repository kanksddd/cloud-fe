import { useEffect, useRef, useState } from "react"

const APPSYNC_API_ID = "nuzqyia5afgtldjifvnfcl5gum"
const REGION = "ap-southeast-1"
const GRAPHQL_API_HOST = `${APPSYNC_API_ID}.appsync-api.${REGION}.amazonaws.com`
const WSS_ENDPOINT = `wss://${APPSYNC_API_ID}.appsync-realtime-api.${REGION}.amazonaws.com/graphql`
const API_KEY = "da2-rcqb53kctbh3rb3ecl6pwnbwby"

export default function CustomWsSubscription() {
  const [messages, setMessages] = useState<any[]>([])
  const socketRef = useRef<WebSocket | null>(null)
  const subscriptionIdRef = useRef<string>("")
  const isAckRef = useRef(false)

  useEffect(() => {
    const socket = new WebSocket(WSS_ENDPOINT, "graphql-ws")
    socketRef.current = socket

    socket.onopen = () => {
      console.log("[WS] connected, sending connection_init…")

      socket.send(JSON.stringify({
        type: "connection_init",
        payload: {
          headers: {
            "x-api-key": API_KEY
          }
        }
      }))
      
    }

    socket.onmessage = ({ data }) => {
      const msg = JSON.parse(data)
      switch (msg.type) {
        case "connection_ack":
          console.log("[WS] connection_ack:", msg.payload)
          isAckRef.current = true
          startSubscription(socket)
          break
        case "ka":
          break
        case "start_ack":
          console.log("[WS] subscription acknowledged:", msg.id)
          break
        case "data":
          const parsed = JSON.parse(msg.payload.data)
          console.log("[WS] subscription data:", parsed)
          setMessages(prev => [parsed.onTextAdded, ...prev])
          break
        case "error":
          console.error("[WS] error:", msg.payload)
          break
        default:
          console.warn("[WS] unknown message:", msg)
      }
    }

    socket.onerror = err => {
      console.error("[WS] socket error:", err)
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        stopSubscription()
        socket.close()
      }
    }
  }, [])

  function startSubscription(socket: WebSocket) {
    const query = `
      subscription OnTextAdded {
        onTextAdded {
          id
          text
          createdAt
        }
      }
    `
    const id = `${Date.now()}`
    subscriptionIdRef.current = id

    const payload = {
      data: JSON.stringify({ query, variables: {} }),
      extensions: {
        authorization: {
          "host": GRAPHQL_API_HOST,
          "x-api-key": API_KEY
        }
      }
    }

    socket.send(JSON.stringify({ id, type: "start", payload }))
  }

  function stopSubscription() {
    if (socketRef.current && subscriptionIdRef.current) {
      socketRef.current.send(JSON.stringify({ id: subscriptionIdRef.current, type: "stop" }))
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Live Text Feed (Custom WebSocket)</h1>
      {messages.map(msg => (
        <div key={msg.id} className="bg-gray-100 rounded p-3 mb-2 shadow">
          <p>{msg.text}</p>
          <small className="text-gray-500">{new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
