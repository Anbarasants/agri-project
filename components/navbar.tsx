"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  // Check if user is logged in (would use actual auth in real app)
  useEffect(() => {
    // Simulate checking auth state
    const checkAuth = () => {
      const user = localStorage.getItem("user")
      if (user) {
        setIsLoggedIn(true)
        // Check if admin
        const userData = JSON.parse(user)
        setIsAdmin(userData.email === "admin@gmail.com")
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setIsAdmin(false)
    // Redirect to home page
    window.location.href = "/"
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Cart", href: "/cart" },
    { name: "Orders", href: "/orders" },
  ]

  if (isAdmin) {
    navLinks.push({ name: "Admin Panel", href: "/admin" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.name}>
                    <Link
                      href={link.href}
                      className={`text-lg font-medium ${
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </SheetClose>
                ))}
                {isLoggedIn ? (
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <SheetClose asChild>
                    <Link href="/login">
                      <Button variant="default">Login</Button>
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsHPUdeeW67M7jsF1y4JxssrQB4ab90-VRfA&s"
              alt="Arul Jayam Machinery"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="hidden font-bold sm:inline-block">ARUL JAYAM MACHINERY</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium ${
                pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {isLoggedIn ? (
            <div className="relative group">
              <Link href="/profile">
                <Button variant="ghost" size="icon" aria-label="Profile">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
