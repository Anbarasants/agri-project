export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  colors: string[];
  rating: number;
  totalReviews: number;
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
} 