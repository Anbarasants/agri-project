"use client"

import { useEffect, useState } from 'react'
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

export default function UserOrders({ userEmail }: { userEmail: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserOrders()
  }, [userEmail])

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      
      // Filter orders for the current user
      const userOrders = data.filter((order: Order) => order.user.email === userEmail)
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
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      
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
                {order.products.map((product, index) => (
                  <div key={index} className="mb-1">
                    {product.quantity}x {product.name}
                  </div>
                ))}
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
  )
} 