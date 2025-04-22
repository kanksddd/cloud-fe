import {
  NavigationMenu,
 
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,

} from "@/components/ui/navigation-menu"

import { Link, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Button } from "./components/ui/button"
import { useLocation } from "react-router"
import { useVolume } from './components/ui/VolumeContext.tsx'


export default function NavBar() {
  const [username, setUsername] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { volume, setVolume } = useVolume()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "null")
    if (user?.username) {
      setUsername(user.username)
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem("loggedInUser")
    setUsername(null)
    navigate("/Home")
  }

  return (
    <div className="w-full fixed top-0 left-0 bg-transparent backdrop-blur-md border-b border-slate-800 z-50 text-white">
      <div className="w-full py-4 flex items-center justify-between px-4">
  
  <div className="flex items-center gap-6">
    <div className="text-xl font-bold tracking-widest text-white">
      MEEM CLICK
    </div>
    <div className="group flex items-center gap-2 relative">
  <span className="text-lg cursor-pointer">
    {volume === 0 ? "🔇" : volume < 0.4 ? "🔈" : volume < 0.7 ? "🔉" : "🔊"}
  </span>
  <input
    type="range"
    min={0}
    max={1}
    step={0.01}
    value={volume}
    onChange={(e) => setVolume(parseFloat(e.target.value))}
    className="w-28 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  />
</div>
  </div>
  
        <NavigationMenu>
        
          <NavigationMenuList className="flex space-x-6 text-sm font-semibold tracking-widest uppercase">
            <NavigationMenuItem>
              <Link to={'/Home'}>
              <NavigationMenuLink className={location.pathname === "/Home" ? "bg-white text-black rounded px-3 py-1" : ""}>
                Home
              </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={'/MySound'}>
                <NavigationMenuLink className={location.pathname === "/MySound" ? "bg-white text-black rounded px-3 py-1" : ""}>My Sound</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={'/CreateSound'}>
                <NavigationMenuLink className={location.pathname === "/CreateSound" ? "bg-white text-black rounded px-3 py-1" : ""}>Create Sound</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={'/UploadSound'}>
              <NavigationMenuLink className={location.pathname === "/UploadSound"  ? "bg-white text-black rounded px-3 py-1" : ""}>
                Upload Sound
              </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <div className="flex items-center gap-4 text-sm tracking-widest">
              {username ? (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink>Welcome! {username}...</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button variant="ghost" onClick={handleLogout} className="bg-red-500 text-black hover:bg-white px-3 py-1 rounded">
                      LOGOUT
                    </Button>
                  </NavigationMenuItem>
                </>
              ) : (
                
                  <Link to="/Login">
                    <NavigationMenuLink className={location.pathname === "/Login" ? "bg-white text-black rounded px-3 py-1" : ""}>SIGN IN</NavigationMenuLink>             
                  </Link>
              )}
            </div>
            </NavigationMenuList>
        </NavigationMenu>
          </div>  
          
      </div>
    
      
    )
}

