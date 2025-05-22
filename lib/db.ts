import mongoose from 'mongoose';

// Load environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Amudhavan:amudhavan13@myatlasclusteredu.ednov.mongodb.net/jayam-machinery';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

const cached: GlobalMongoose = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  try {
    if (cached.conn) {
      console.log('Using existing database connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts: mongoose.ConnectOptions = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // Increased timeout for Atlas
        family: 4, // Use IPv4, skip trying IPv6
      };

      console.log('Creating new database connection to MongoDB Atlas');
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance;
    console.log('Successfully connected to MongoDB Atlas');
    return mongooseInstance;
  } catch (e) {
    cached.promise = null;
    console.error('Database connection error:', e);
    throw new Error('Failed to connect to MongoDB Atlas. Please check your connection string and network.');
  }
}

// Test the database connection
connectDB()
  .then(() => console.log('Initial MongoDB Atlas connection successful'))
  .catch((err) => console.error('Initial MongoDB Atlas connection failed:', err));

export default connectDB; 