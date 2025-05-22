"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminAddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    colors: [] as string[],
    images: ["", "", "", ""],
    topSelling: false,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData({
      ...formData,
      images: updatedImages,
    })
  }

  const handleColorToggle = (color: string) => {
    const updatedColors = formData.colors.includes(color)
      ? formData.colors.filter((c) => c !== color)
      : [...formData.colors, color]

    setFormData({
      ...formData,
      colors: updatedColors,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate form
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.stock ||
      formData.colors.length === 0 ||
      !formData.images[0]
    ) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      // Create new product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        colors: formData.colors,
        images: formData.images.filter((img) => img), // Remove empty image URLs
        topSelling: formData.topSelling,
      }

      // Send data to MongoDB API
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      const result = await response.json();
      console.log('Product added successfully:', result);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        colors: [],
        images: ["", "", "", ""],
        topSelling: false,
      })

      // Show success message
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error adding product:', err)
      setError(err instanceof Error ? err.message : 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const availableColors = ["Red", "Blue", "Green", "Yellow", "Black", "White"]
  const availableCategories = [
    "Cultivators",
    "Tillers",
    "Seeders",
    "Harvesters",
    "Irrigation",
    "Fertilizers",
    "Sprayers",
  ]

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Add New Product</h2>

      {success && <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">Product added successfully!</div>}
      {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-2 block">Colors *</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={formData.colors.includes(color)}
                      onCheckedChange={() => handleColorToggle(color)}
                      disabled={loading}
                    />
                    <Label htmlFor={`color-${color}`}>{color}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Product Images *</Label>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <Input
                    key={index}
                    placeholder={`Image URL ${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="topSelling"
                checked={formData.topSelling}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, topSelling: checked as boolean })
                }
                disabled={loading}
              />
              <Label htmlFor="topSelling">Mark as Top Selling</Label>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </Button>
      </form>
    </div>
  )
}
