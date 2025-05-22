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

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  useEffect(() => {
    // Get user data
    const userDataStr = localStorage.getItem('user')
    if (!userDataStr) {
      router.push('/login')
      return
    }

    // Get cart items
    const cartDataStr = localStorage.getItem('cart')
    if (!cartDataStr) {
      router.push('/cart')
      return
    }

    try {
      const userData = JSON.parse(userDataStr)
      const cartData = JSON.parse(cartDataStr)

      // Validate cart data
      if (!Array.isArray(cartData)) {
        throw new Error('Invalid cart data')
      }

      // Validate each cart item has required fields
      const validatedCartItems = cartData.filter((item: any) => {
        const isValid = item && 
          typeof item === 'object' &&
          typeof item._id === 'string' && 
          typeof item.name === 'string' && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' &&
          item.quantity > 0

        if (!isValid) {
          console.warn('Invalid cart item:', item)
        }
        return isValid
      })

      if (validatedCartItems.length === 0) {
        localStorage.removeItem('cart') // Clear invalid cart data
        throw new Error('No valid items in cart')
      }

      // Pre-fill shipping details with user data
      setShippingDetails({
        name: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      })

      setCartItems(validatedCartItems)
    } catch (err) {
      console.error('Error parsing stored data:', err)
      setError('Error loading cart data. Please try refreshing the page.')
      // Clear invalid cart data
      localStorage.removeItem('cart')
      router.push('/cart')
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate shipping details
      if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.phone || !shippingDetails.address) {
        throw new Error('Please fill in all shipping details')
      }

      // Validate cart items
      if (!cartItems.length) {
        throw new Error('Your cart is empty')
      }

      // Validate product IDs
      const invalidItems = cartItems.filter(item => !item._id || typeof item._id !== 'string')
      if (invalidItems.length > 0) {
        localStorage.removeItem('cart') // Clear invalid cart data
        throw new Error('Some items in your cart are invalid. Please try clearing your cart and adding the items again.')
      }

      // Calculate total amount
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)

      // Prepare order data
      const orderData = {
        user: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          address: shippingDetails.address,
          phone: shippingDetails.phone,
        },
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
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
      }

      console.log('Sending order data:', orderData)

      try {
        // Place order through API
        const response = await fetch('/api/orders/place', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        // First try to parse the response as JSON
        let data
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          // If not JSON, get the text and log it for debugging
          const text = await response.text()
          console.error('Received non-JSON response:', text)
          throw new Error('Server returned invalid response format')
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to place order')
        }

        // Clear cart
        localStorage.removeItem('cart')

        // Update user data with shipping details
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        userData.address = shippingDetails.address
        userData.phone = shippingDetails.phone
        localStorage.setItem('user', JSON.stringify(userData))

        // Show success message and redirect to orders page
        alert('Order placed successfully!')
        router.push('/orders')
      } catch (err) {
        console.error('API Error:', err)
        throw new Error(err instanceof Error ? err.message : 'Error communicating with server')
      }
    } catch (err) {
      console.error('Error placing order:', err)
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Your cart is empty</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Summary */}
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
                <span>₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Details Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Details</h2>
          
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea
                id="address"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-2"
              >
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
