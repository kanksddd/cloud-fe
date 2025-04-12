import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"  
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
        <NavigationMenu>
        <NavigationMenuList>
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
          <NavigationMenuItem>
            <Link to="/Login">
              <NavigationMenuLink>Login</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        </NavigationMenuList>
      </NavigationMenu>
    )
}

