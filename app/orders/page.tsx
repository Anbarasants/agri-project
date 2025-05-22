"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface OrderProduct {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  user: {
    name: string
    email: string
    address: string
  }
  products: OrderProduct[]
  totalAmount: number
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  orderDate: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userDataStr = localStorage.getItem('user')
    if (!userDataStr) {
      router.push('/login')
      return
    }

    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    try {
      const userDataStr = localStorage.getItem('user')
      if (!userDataStr) return

      const userData = JSON.parse(userDataStr)

      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const allOrders = await response.json()
      
      // Filter orders for current user
      const userOrders = allOrders.filter(
        (order: Order) => order.user.email === userData.email
      )
      
      setOrders(userOrders)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading your orders...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  if (orders.length === 0) {
    return <div className="text-center p-4">You haven't placed any orders yet.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono">{order._id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {product.quantity}x {product.name}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
