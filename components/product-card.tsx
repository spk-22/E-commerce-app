"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  discount?: number
  isNew?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasDiscount = product.discount && product.discount > 0

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {product.isNew && (
            <Badge className="absolute left-3 top-3 bg-green-500 text-white hover:bg-green-600">New</Badge>
          )}
          {hasDiscount && (
            <Badge className="absolute right-3 top-3 bg-red-500 text-white hover:bg-red-600">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center">
          <p className="font-bold text-lg text-primary">${product.price.toFixed(2)}</p>
          {hasDiscount && (
            <p className="ml-2 text-sm text-muted-foreground line-through">
              ${(product.price / (1 - (product.discount || 0) / 100)).toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full group-hover:bg-primary-dark" onClick={onAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
