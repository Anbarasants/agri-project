"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OtpVerification from "@/components/otp-verification"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOtp, setShowOtp] = useState(false)
  const [userId, setUserId] = useState<string>("")

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check if admin
      if (loginData.email === "admin@gmail.com" && loginData.password === "admin@123") {
        const adminUser = {
          _id: "admin",
          username: "Admin",
          email: "admin@gmail.com",
          phone: "1234567890",
          address: "Admin Office",
          isAdmin: true,
          isVerified: true
        }

        localStorage.setItem("user", JSON.stringify(adminUser))
        router.push("/admin")
        return
      }

      // For regular users, call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUserId(data.userId);
      setShowOtp(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerified = async (userData: any) => {
    try {
      // Get user data from the server
      const response = await fetch(`/api/auth/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
      
      // Store user data in localStorage with correct field names
      localStorage.setItem("user", JSON.stringify({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified
      }));

      // Redirect to home page
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process login');
    }
  }

  return (
    <div className="container py-8 max-w-md mx-auto">
      {showOtp ? (
        <OtpVerification 
          userId={userId}
          email={loginData.email} 
          onVerified={handleOtpVerified} 
          onCancel={() => setShowOtp(false)} 
        />
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex justify-center mb-6">
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsHPUdeeW67M7jsF1y4JxssrQB4ab90-VRfA&s"
              alt="Arul Jayam Machinery"
              width={80}
              height={80}
              className="rounded-md"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOtp, setShowOtp] = useState(false)
  const [userId, setUserId] = useState<string>("")

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("signup change called");
    const { name, value } = e.target
    setSignupData({
      ...signupData,
      [name]: value,
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    console.log("signup called");
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setUserId(data.userId);
      setShowOtp(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerified = async (userData: any) => {
    try {
      // Get user data from the server
      const response = await fetch(`/api/auth/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
      
      // Store user data in localStorage with correct field names
      localStorage.setItem("user", JSON.stringify({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified
      }));

      // Redirect to home page
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process signup');
    }
  }

  if (showOtp) {
    return (
      <OtpVerification
        userId={userId}
        email={signupData.email}
        onVerified={handleOtpVerified}
        onCancel={() => setShowOtp(false)}
      />
    )
  }

  return (
    <form onSubmit={handleSignup}>
      <div className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="signup-username">Username</Label>
          <Input
            id="signup-username"
            name="username"
            value={signupData.username}
            onChange={handleSignupChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            value={signupData.email}
            onChange={handleSignupChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="signup-phone">Phone</Label>
          <Input
            id="signup-phone"
            name="phone"
            type="tel"
            value={signupData.phone}
            onChange={handleSignupChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="signup-address">Address</Label>
          <Input
            id="signup-address"
            name="address"
            value={signupData.address}
            onChange={handleSignupChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={signupData.password}
              onChange={handleSignupChange}
              required
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  )
}
