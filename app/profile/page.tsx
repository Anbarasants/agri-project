"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Mail, Phone, MapPin, LogOut, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData({
      username: parsedUser.username || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
      address: parsedUser.address || "",
    })

    // Check if user has a profile image
    if (parsedUser.profileImage) {
      setProfileImage(parsedUser.profileImage)
    }

    setLoading(false)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileImageChange = () => {
    // In a real app, this would upload the image to a server
    // For this demo, we'll just use a placeholder
    const newImage = "/placeholder.svg?height=200&width=200&text=Profile"
    setProfileImage(newImage)

    // Update user data
    const updatedUser = {
      ...user,
      profileImage: newImage,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()

    // Update user data
    const updatedUser = {
      ...user,
      ...formData,
    }

    // Update in localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Update users array
    if (!user.isAdmin) {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u: any) => (u.id === user.id ? updatedUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    setUser(updatedUser)
    alert("Profile updated successfully!")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="border rounded-lg p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                fill
                className="rounded-full object-cover border-4 border-background"
              />
              <button
                onClick={handleProfileImageChange}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2"
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Change profile picture</span>
              </button>
            </div>

            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-muted-foreground">{user.email}</p>

            <Separator className="my-4" />

            <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="border rounded-lg p-6">
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                          readOnly={user.isAdmin}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Update Profile
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <ProfileOrders />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ProfileOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user ID
    const userData = localStorage.getItem("user")
    if (!userData) return

    const user = JSON.parse(userData)

    // Get all orders
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")

    // Filter orders for this user
    // In a real app, orders would have a userId field
    // For this demo, we'll just show all orders for simplicity
    setOrders(allOrders)
    setLoading(false)
  }, [])

  if (loading) {
    return <p>Loading orders...</p>
  }

  if (orders.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
        <Button asChild className="mt-4">
          <a href="/">Start Shopping</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">Order #{order.id}</h3>
              <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted">{order.status}</span>
              <p className="font-semibold mt-1">₹{order.total.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((item: any) => (
              <div key={`${item.id}-${item.color}`} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            {order.status !== "delivered" && (
              <Button variant="outline" size="sm" className="text-red-500">
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
