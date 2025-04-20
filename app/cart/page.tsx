"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { products } from "@/lib/data"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Get cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Map product IDs to full product objects with quantity
    const items = storedCart.reduce((acc: any[], id: number) => {
      const product = products.find((p) => p.id === id)
      if (!product) return acc

      const existingItem = acc.find((item) => item.id === id)
      if (existingItem) {
        existingItem.quantity += 1
        return acc
      }

      return [...acc, { ...product, quantity: 1 }]
    }, [])

    setCartItems(items)

    // Calculate total
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(cartTotal)
  }, [])

  const removeFromCart = (productId: number) => {
    // Get current cart
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Remove one instance of the product
    const index = storedCart.indexOf(productId)
    if (index > -1) {
      storedCart.splice(index, 1)
      localStorage.setItem("cart", JSON.stringify(storedCart))

      // Update state
      const updatedItems = cartItems
        .map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: item.quantity - 1 }
          }
          return item
        })
        .filter((item) => item.quantity > 0)

      setCartItems(updatedItems)

      // Recalculate total
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setTotal(newTotal)
    }
  }

  const placeOrder = () => {
    if (cartItems.length === 0) return

    // Get existing orders or initialize empty array
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")

    // Create new order
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total,
      date: new Date().toISOString(),
      status: "pending",
    }

    // Save updated orders
    localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]))

    // Clear cart
    localStorage.setItem("cart", "[]")
    setCartItems([])
    setTotal(0)

    // Navigate to orders page
    router.push("/orders")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <ShoppingBag className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <Card className="border-dashed bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="mt-4 text-xl font-medium">Your cart is empty</p>
            <p className="text-muted-foreground">Add some products to your cart to continue shopping</p>
            <Button className="mt-6" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-1 text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(total + total * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={placeOrder}>
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
