"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Package, Clock, Check, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type OrderStatus = "pending" | "delivered" | "returned"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: number
  items: OrderItem[]
  total: number
  date: string
  status: OrderStatus
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Get orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(storedOrders)
  }, [])

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "delivered":
        return <Check className="h-4 w-4" />
      case "returned":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
      case "returned":
        return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
      default:
        return ""
    }
  }

  // Function to update order status (for demo purposes)
  const updateOrderStatus = (orderId: number) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const newStatus: OrderStatus =
          order.status === "pending" ? "delivered" : order.status === "delivered" ? "returned" : "pending"

        return { ...order, status: newStatus }
      }
      return order
    })

    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Package className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <Card className="border-dashed bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-4">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="mt-4 text-xl font-medium">No orders yet</p>
            <p className="text-muted-foreground">You haven't placed any orders yet</p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>Order #{order.id.toString().slice(-5)}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${getStatusColor(order.status)}`}
                        onClick={() => updateOrderStatus(order.id)}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {format(new Date(order.date), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">${(order.total + order.total * 0.1).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="font-medium mb-4">Order Items</h4>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
