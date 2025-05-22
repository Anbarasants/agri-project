import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: Request) {
  try {
    // Connect to database
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    // Parse order data
    let orderData;
    try {
      orderData = await request.json();
      console.log('Received order data:', orderData);
    } catch (error) {
      console.error('Error parsing request data:', error);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Validate user data
    if (!orderData.user?.name || !orderData.user?.email || !orderData.user?.address || !orderData.user?.phone) {
      return NextResponse.json(
        { error: 'Missing required user information' },
        { status: 400 }
      );
    }

    // Validate products array
    if (!orderData.products || !Array.isArray(orderData.products) || orderData.products.length === 0) {
      return NextResponse.json(
        { error: 'No products in order' },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!orderData.paymentMethod || !['cod', 'upi', 'card'].includes(orderData.paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Validate and convert product IDs
    try {
      const productsWithObjectIds = await Promise.all(
        orderData.products.map(async (product: any) => {
          try {
            const productId = new mongoose.Types.ObjectId(product.productId);
            console.log('Looking up product:', productId);
            
            const existingProduct = await Product.findById(productId);
            if (!existingProduct) {
              throw new Error(`Product not found: ${product.productId}`);
            }
            
            return {
              ...product,
              productId
            };
          } catch (err) {
            console.error('Error processing product:', product.productId, err);
            throw new Error(`Invalid product ID: ${product.productId}`);
          }
        })
      );

      // Create order with validated products
      const order = await Order.create({
        ...orderData,
        products: productsWithObjectIds,
        paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid'
      });
      
      // Populate product details
      const populatedOrder = await Order.findById(order._id)
        .populate('products.productId');

      console.log('Order created successfully:', order._id);
      return NextResponse.json({
        message: 'Order placed successfully',
        order: populatedOrder
      });
    } catch (err) {
      console.error('Error processing products:', err);
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Failed to process products' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json(
      { error: 'Failed to place order. Please try again later.' },
      { status: 500 }
    );
  }
} 