"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
}

interface PlaceOrderProps {
  cartItems: CartItem[]
  onOrderPlaced: () => void
}

export default function PlaceOrder({ cartItems, onOrderPlaced }: PlaceOrderProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlaceOrder = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get user data from localStorage
      const userDataStr = localStorage.getItem('user')
      if (!userDataStr) {
        router.push('/login')
        return
      }

      const userData = JSON.parse(userDataStr)

      // Calculate total amount
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)

      // Prepare order data
      const orderData = {
        user: {
          name: userData.username,
          email: userData.email,
          address: userData.address || 'Default Address', // You might want to add address in user profile
        },
        products: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        status: 'pending'
      }

      // Place order through API
      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to place order')
      }

      // Clear cart and notify parent
      localStorage.removeItem('cart')
      onOrderPlaced()

      // Show success message and redirect to orders page
      alert('Order placed successfully!')
      router.push('/orders')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return <div className="text-center p-4">Your cart is empty</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
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

      <Button
        className="w-full"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </div>
  )
} 