import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import downloadBackground from "./assets/Background2.jpg"

function App() {
  return (
     <div
       className="min-h-screen bg-cover bg-center flex items-center justify-center text-white"
       style={{ backgroundImage: `url(${downloadBackground})` }}
     >
      <div className="bg-black bg-opacity-50 p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">🎧 Welcome to Meme Soundboard</h1>
        <p className="text-lg mb-6 text-gray-200">
          Your daily dose of sounds, laughter, and meme magic.
        </p>
        <Link to="/Home">
          <Button className="px-8 py-3 text-lg shadow-md hover:scale-105 transition-transform bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            🚀 Enter
          </Button>
        </Link>
      </div>
     </div>
  )
}

export default App
