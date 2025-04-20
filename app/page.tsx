"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"

import ProductCard from "@/components/product-card"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [cart, setCart] = useState<number[]>([])

  const addToCart = (productId: number) => {
    setCart([...cart, productId])

    // Update cart in localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    localStorage.setItem("cart", JSON.stringify([...existingCart, productId]))

    router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Next-Gen Tech at Your Fingertips</h1>
          <p className="mt-4 text-lg text-gray-100">
            Discover the latest in electronics and upgrade your digital lifestyle today.
          </p>
          <Button className="mt-6 bg-white text-primary hover:bg-gray-100">Shop Now</Button>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/20 blur-3xl"></div>
        <div className="absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>

      {/* Featured Products Section */}
      <div className="space-y-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Sparkles className="ml-2 h-6 w-6 text-yellow-500" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product.id)} />
          ))}
        </div>
      </div>

      {/* All Products Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">All Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
