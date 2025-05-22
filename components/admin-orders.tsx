"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      // Refresh orders after update
      fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status')
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading orders...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-mono">{order._id}</TableCell>
              <TableCell>
                <div>{order.user.name}</div>
                <div className="text-sm text-gray-500">{order.user.email}</div>
                <div className="text-sm text-gray-500">{order.user.address}</div>
              </TableCell>
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
              <TableCell>
                {order.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOrderStatus(order._id, 'processing')}
                  >
                    Mark Processing
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                  >
                    Mark Delivered
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
