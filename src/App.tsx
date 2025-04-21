import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import downloadBackground from "./assets/Background2.jpg"

function App() {
  return (
     <div
       className="min-h-screen bg-gradient-to-br from-[#0d0f2b] via-[#1b1b1b] to-[#0a0a0a] text-white flex items-center justify-center "
     >
      <div className="bg-black bg-opacity-50 p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">MEEM CLICK</h1>
        
        <Link to="/Home">
          <Button className="px-8 py-3 text-lg shadow-md hover:scale-105 transition-transform bg-blue-400 text-white">
            Play
          </Button>
        </Link>
      </div>
     </div>
  )
}

export default App
