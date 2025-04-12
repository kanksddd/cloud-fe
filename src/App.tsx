import { Button } from "@/components/ui/button"
import { Link } from "react-router"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Link to={'/Home'}>
        <Button>Home</Button>
      </Link>

    </div>
  )
}

export default App

