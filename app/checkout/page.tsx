"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  image?: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const userDataStr = localStorage.getItem('user')
    if (!userDataStr) return router.push('/login')

    const cartDataStr = localStorage.getItem('cart')
    if (!cartDataStr) return router.push('/cart')

    try {
      const userData = JSON.parse(userDataStr)
      const cartData = JSON.parse(cartDataStr)

      const validatedCartItems = cartData.filter((item: any) =>
        item && typeof item._id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
      )

      if (validatedCartItems.length === 0) {
        localStorage.removeItem('cart')
        throw new Error('No valid items in cart')
      }

      setShippingDetails({
        name: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      })

      setCartItems(validatedCartItems)
    } catch (err) {
      console.error(err)
      setError('Error loading cart data. Please try again.')
      localStorage.removeItem('cart')
      router.push('/cart')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingDetails(prev => ({ ...prev, [name]: value }))
  }

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = resolve
      document.body.appendChild(script)
    })

  const handlePayment = async () => {
    await loadRazorpayScript()

    const options = {
      key: "rzp_test_OqKM3VAcZ1O5bK",
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      name: "MUKESH",
      description: "Order Payment",
      image: "/coffee-cup.png",
      handler: async function (response: any) {
        console.log("Payment successful", response)
        await placeOrder("paid")
      },
      prefill: {
        name: shippingDetails.name,
        email: shippingDetails.email,
        contact: shippingDetails.phone
      },
      theme: {
        color: "#6366F1"
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const placeOrder = async (paymentStatus: "pending" | "paid") => {
    const orderData = {
      user: shippingDetails,
      products: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      status: 'pending',
      orderDate: new Date().toISOString(),
      paymentMethod,
      paymentStatus
    }

    try {
      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')

      localStorage.removeItem('cart')

      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      userData.address = shippingDetails.address
      userData.phone = shippingDetails.phone
      localStorage.setItem('user', JSON.stringify(userData))

      alert('✅ Order placed successfully!')
      router.push('/orders')
    } catch (err) {
      console.error('Order error:', err)
      setError(err instanceof Error ? err.message : 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.phone || !shippingDetails.address) {
      setError('Please fill in all shipping details')
      setLoading(false)
      return
    }

    if (!cartItems.length) {
      setError('Your cart is empty')
      setLoading(false)
      return
    }

    if (paymentMethod === 'cod') {
      await placeOrder('pending')
    } else {
      await handlePayment()
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Your cart is empty</p>
        <Button onClick={() => router.push('/')} className="mt-4">Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="border rounded-lg p-4">
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Details</h2>
          {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={shippingDetails.name} onChange={handleInputChange} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={shippingDetails.email} onChange={handleInputChange} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={shippingDetails.phone} onChange={handleInputChange} required disabled={loading} />
            </div>
            <div>
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea id="address" name="address" value={shippingDetails.address} onChange={handleInputChange} required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
