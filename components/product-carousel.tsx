"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  topSelling?: boolean;
}

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const topSellingProducts = products.slice(0, 5)

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topSellingProducts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [topSellingProducts.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % topSellingProducts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + topSellingProducts.length) % topSellingProducts.length)
  }

  if (topSellingProducts.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {topSellingProducts.map((product) => (
          <div key={product._id} className="w-full flex-shrink-0 relative">
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="text-white p-6 md:p-10 max-w-md">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">{product.name}</h2>
                  <p className="mb-4 text-sm md:text-base opacity-90">{product.description.substring(0, 100)}...</p>
                  <Link href={`/product/${product._id}`}>
                    <Button variant="default">View Product</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next slide</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {topSellingProducts.map((product, index) => (
          <button
            key={`dot-${product._id}`}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
