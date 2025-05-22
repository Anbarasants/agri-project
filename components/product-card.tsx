import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  colors: string[]
  stock: number
  topSelling?: boolean
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Ensure product has all required properties with defaults
  const {
    _id,
    name = 'Untitled Product',
    description = 'No description available',
    price = 0,
    images = [],
    category = 'Uncategorized',
    colors = [],
    stock = 0
  } = product || {};

  // If product is completely undefined, show placeholder
  if (!product || !_id) {
    return (
      <div className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt="Product not found"
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">Product Not Found</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 h-10 mb-2">This product is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={images[0] || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 h-10 mb-2">{description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold">₹{price.toLocaleString()}</span>
          <Link href={`/product/${_id}`}>
            <Button variant="default" size="sm">
              View Product
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
