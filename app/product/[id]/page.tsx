"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Plus, Minus, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import ProductReviews from "@/components/product-reviews"

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("")
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch the product
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await response.json();
        console.log('Fetched product:', productData);

        // Ensure product has an images array
        if (!productData.images || !Array.isArray(productData.images)) {
          productData.images = ["/placeholder.svg"];
        }

        // Ensure product has a colors array
        if (!productData.colors || !Array.isArray(productData.colors)) {
          productData.colors = ["Default"];
        }

        setProduct(productData);
        setSelectedColor(productData.colors[0]);

        // Fetch similar products
        const allProductsResponse = await fetch('/api/products');
        if (!allProductsResponse.ok) {
          throw new Error('Failed to fetch similar products');
        }
        const allProducts = await allProductsResponse.json();
        console.log('Fetched all products:', allProducts.length);
        
        const similar = allProducts
          .filter((p: any) => p.category === productData.category && p._id !== id)
          .slice(0, 4);
        console.log('Similar products:', similar.length);
        setSimilarProducts(similar);

        // Add to recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
        const exists = recentlyViewed.some((p: any) => p._id === productData._id)

        if (!exists) {
          const updatedRecentlyViewed = [productData, ...recentlyViewed].slice(0, 5)
          localStorage.setItem("recentlyViewed", JSON.stringify(updatedRecentlyViewed))
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('Fetching product with ID:', id);
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return

    // Ensure all required fields are present and valid
    if (!product._id || !product.name || typeof product.price !== 'number') {
      alert("Invalid product data. Please try again.")
      return
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      quantity: quantity,
      color: selectedColor,
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const existingItemIndex = cart.findIndex((item: any) => 
        item._id === cartItem._id && item.color === cartItem.color
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        cart[existingItemIndex].quantity += quantity
      } else {
        cart.push(cartItem)
      }

      localStorage.setItem("cart", JSON.stringify(cart))
      alert("Product added to cart!")
    } catch (err) {
      console.error("Error updating cart:", err)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  const handleAddToWishlist = () => {
    if (!product) return

    const wishlistItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    const exists = wishlist.some((item: any) => item._id === wishlistItem._id)

    if (!exists) {
      wishlist.push(wishlistItem)
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
      alert("Product added to wishlist!")
    } else {
      alert("Product already in wishlist!")
    }
  }

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p>Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">{error || 'The product you are looking for does not exist.'}</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square border rounded-lg overflow-hidden">
            <Image
              src={product.images?.[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(product.images || []).map((image: string, index: number) => (
              <button
                key={index}
                className={`relative w-20 h-20 border rounded-md overflow-hidden ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-5 w-5 ${
                    star <= (product.rating || 0) 
                      ? "fill-primary text-primary" 
                      : "text-gray-300"
                  }`} 
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              ({product.totalReviews || 0} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold mb-4">₹{product.price?.toLocaleString() || 0}</div>

          <p className="text-muted-foreground mb-6">{product.description || 'No description available.'}</p>

          <div className="space-y-6">
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-2">
                  {product.colors.map((color: string) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={`color-${color}`} />
                      <Label htmlFor={`color-${color}`}>{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" onClick={handleAddToWishlist}>
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="prose max-w-none">
          <p>{product.description}</p>
        </TabsContent>
        <TabsContent value="specifications">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="font-medium">Category</div>
              <div>{product.category}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="font-medium">Stock</div>
              <div>{product.stock} units</div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="font-medium">Colors Available</div>
              <div>{product.colors.join(", ")}</div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <ProductReviews productId={product._id} />
        </TabsContent>
      </Tabs>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
