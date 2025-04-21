import { useEffect, useState } from "react"
import { generateClient } from "aws-amplify/api"
import awsconfig from "../aws-exports"
import Amplify from "aws-amplify"

Amplify.configure(awsconfig)
const client = generateClient()

const subscriptionQuery = /* GraphQL */ `
  subscription {
    onTextAdded {
      id
      text
      createdAt
    }
  }
`

type Item = {
  id: string
  text: string
  createdAt: string
}

export default function Demo2() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const sub = client
      .graphql<{ onTextAdded: Item }>({
        query: subscriptionQuery
      })
      .subscribe({
        next: ({ data }) => {
          if (data) setItems(prev => [data.onTextAdded, ...prev])
        },
        error: err => console.error("Subscription error:", err)
      })

    return () => sub.unsubscribe()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Live Text Feed</h1>
      {items.map(item => (
        <div key={item.id} className="bg-gray-100 p-4 rounded shadow mb-2">
          <p>{item.text}</p>
          <small className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}
