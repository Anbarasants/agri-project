import mongoose from 'mongoose';
import Product from '../models/Product';

// Local MongoDB URI (Compass)
const LOCAL_URI = 'mongodb://localhost:27017/jayam-machinery';

// Atlas MongoDB URI
const ATLAS_URI = 'mongodb+srv://Amudhavan:amudhavan13@myatlasclusteredu.ednov.mongodb.net/jayam-machinery';

async function migrateProducts() {
  try {
    // Connect to local MongoDB
    console.log('Connecting to local MongoDB...');
    const localConnection = await mongoose.createConnection(LOCAL_URI);
    
    // Get the Product model for local connection
    const LocalProduct = localConnection.model('Product', Product.schema);
    
    // Fetch all products from local DB
    console.log('Fetching products from local MongoDB...');
    const products = await LocalProduct.find({});
    console.log(`Found ${products.length} products in local database`);

    // Connect to Atlas
    console.log('Connecting to MongoDB Atlas...');
    const atlasConnection = await mongoose.createConnection(ATLAS_URI);
    
    // Get the Product model for Atlas connection
    const AtlasProduct = atlasConnection.model('Product', Product.schema);

    // Insert products into Atlas
    console.log('Inserting products into MongoDB Atlas...');
    for (const product of products) {
      const productData = product.toObject();
      delete productData._id; // Remove _id to let Atlas generate new ones
      
      // Check if product already exists in Atlas (using name as unique identifier)
      const existingProduct = await AtlasProduct.findOne({ name: productData.name });
      
      if (!existingProduct) {
        await AtlasProduct.create(productData);
        console.log(`Migrated product: ${productData.name}`);
      } else {
        console.log(`Product already exists in Atlas: ${productData.name}`);
      }
    }

    console.log('Migration completed successfully!');

    // Close connections
    await localConnection.close();
    await atlasConnection.close();
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProducts(); 