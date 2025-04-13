import {
  NavigationMenu,
 
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,

} from "@/components/ui/navigation-menu"

import { Link, useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { Button } from "./components/ui/button"


export default function NavBar() {
  const [username, setUsername] = useState<string | null>(null)
  const navigate = useNavigate()

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
    <div className="w-full bg-gradient-to-r from-pink-300 via-pink-400 to-purple-300 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold tracking-widest flex items-center gap-2">
          🎧 MEME BOARD
        </div>
        <NavigationMenu>

          <NavigationMenuList className="flex space-x-6 text-sm font-semibold tracking-widest uppercase">
            <NavigationMenuItem>
              <Link to={'/Home'}>
                <NavigationMenuLink>Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink onClick={() => {
                const user = localStorage.getItem("loggedInUser")
                if (user) {
                  navigate("/UploadSound")
                }
                else {
                  navigate("/Login")
                }
              }}>
                UploadSound
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={'/MySound'}>
                <NavigationMenuLink>MySound</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={'/CreateSound'}>
                <NavigationMenuLink>CreateSound</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <div className="flex items-center gap-4 text-sm tracking-widest">
              {username ? (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink>Welcome, {username}</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button variant="ghost" onClick={handleLogout}>
                      Logout
                    </Button>
                  </NavigationMenuItem>
                </>
              ) : (
                
                  <Link to="/Login">
                    <NavigationMenuLink>Login</NavigationMenuLink>             
                  </Link>
              )}
            </div>
            </NavigationMenuList>
        </NavigationMenu>
            
          </div>
      </div>
    
      
    )
}

