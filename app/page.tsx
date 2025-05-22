"use client"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import ProductCarousel from "@/components/product-carousel"
import ProductCard from "@/components/product-card"

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  colors: string[];
  stock: number;
  topSelling?: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        setAllProducts(products);
        setFilteredProducts(products);
        
        // Update price range based on actual product prices
        const prices = products.map((p: Product) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange([minPrice, maxPrice]);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get recently viewed products from localStorage
  useEffect(() => {
    try {
      const viewed = localStorage.getItem("recentlyViewed")
      if (viewed) {
        const parsedViewed = JSON.parse(viewed);
        // Validate that each item has _id
        const validProducts = parsedViewed.filter((product: any) => 
          product && typeof product === 'object' && '_id' in product
        );
        setRecentlyViewed(validProducts);
      }
    } catch (err) {
      console.error('Error loading recently viewed products:', err);
      // Clear invalid data
      localStorage.removeItem("recentlyViewed");
    }
  }, [])

  // Filter products based on search query and filters
  useEffect(() => {
    let filtered = [...allProducts]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Price filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) => product.colors.some((color) => selectedColors.includes(color)))
    }

    setFilteredProducts(filtered)
  }, [searchQuery, priceRange, selectedCategories, selectedColors, allProducts])

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Handle color selection
  const handleColorChange = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  // Get unique categories and colors from actual products
  const categories = Array.from(new Set(allProducts.map((product) => product.category)))
  const colors = Array.from(new Set(allProducts.flatMap((product) => product.colors)))

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Product Carousel */}
      <section className="mb-8">
        <ProductCarousel products={allProducts.filter(p => p.topSelling)} />
      </section>

      {/* Search Bar */}
      <section className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((product) => (
              <ProductCard 
                key={`recent-${product._id}`} 
                product={product} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Products with Filter */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden mb-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="px-1">
                      <Slider
                        defaultValue={priceRange}
                        max={100000}
                        step={1000}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value)}
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={`mobile-${category}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <label
                            htmlFor={`mobile-category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="color">
                  <AccordionTrigger>Color</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {colors.map((color) => (
                        <div key={`mobile-${color}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-color-${color}`}
                            checked={selectedColors.includes(color)}
                            onCheckedChange={() => handleColorChange(color)}
                          />
                          <label
                            htmlFor={`mobile-color-${color}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {color}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20 border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <Slider
                defaultValue={priceRange}
                max={100000}
                step={1000}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={`desktop-${category}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Color</h4>
              <div className="space-y-2">
                {colors.map((color) => (
                  <div key={`desktop-${color}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => handleColorChange(color)}
                    />
                    <label
                      htmlFor={`color-${color}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
