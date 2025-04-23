import { useState } from "react"

export default function Demopage1() {
  const [text, setText] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const uploadText = async () => {
    setStatus("loading")
    try {
      const response = await fetch("https://oazmsesxjpxe42vbgdi7jv3gaa0tapzx.lambda-url.ap-southeast-1.on.aws/", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" }
      })

      if (response.ok) {
        setStatus("success")
        setText("")
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Upload Text</h1>

      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="border p-2"
        placeholder="Enter some text"
      />

      <button
        onClick={uploadText}
        disabled={!text || status === "loading"}
        className="ml-2 bg-blue-500 text-white px-4 py-2 hover:bg-black disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Submit"}
      </button>

      {status === "success" && (
        <p className="mt-2 text-green-600">✅ Successfully submitted!</p>
      )}

      {status === "error" && (
        <p className="mt-2 text-red-600">❌ Failed to submit. Try again.</p>
      )}
    </div>
  )
}
