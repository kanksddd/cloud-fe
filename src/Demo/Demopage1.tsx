import { useState } from "react"

export default function Demopage1() {
  const [text, setText] = useState("")

  const uploadText = async () => {
    await fetch("https://oazmsesxjpxe42vbgdi7jv3gaa0tapzx.lambda-url.ap-southeast-1.on.aws/", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" }
    })
    setText("")
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Upload Text</h1>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        className="border p-2"
        placeholder="Enter some text"
      />
      <button onClick={uploadText} className="ml-2 bg-blue-500 text-white px-4 py-2 hover:bg-black">
        Submit
      </button>
    </div>
  )
}
