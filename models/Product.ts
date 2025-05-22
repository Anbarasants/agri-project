import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0, 'At least one image is required']
  },
  colors: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0, 'At least one color is required']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  }
}, {
  timestamps: true
});

// Add indexes for common queries
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema); 