import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.DATABASE_URL) {
    throw new Error('Please add your Mongo URI to .env');
}

const uri = process.env.DATABASE_URL;

// Enhanced connection options to prevent timeouts
const options: MongoClientOptions = {
    // Increase connection timeout to 60 seconds
    connectTimeoutMS: 60000,

    // Increase socket timeout to 2 minutes
    socketTimeoutMS: 120000,

    // Server selection timeout
    serverSelectionTimeoutMS: 60000,

    // Connection pool settings
    maxPoolSize: 50,
    minPoolSize: 5,

    // Retry writes for better reliability
    retryWrites: true,
    retryReads: true,

    // Compression for better performance
    compressors: ['zlib'],
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect()
            .then((client) => {
                console.log('✅ MongoDB connected successfully');
                return client;
            })
            .catch((error) => {
                console.error('❌ MongoDB connection error:', error.message);
                throw error;
            });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
        .then((client) => {
            console.log('✅ MongoDB connected successfully');
            return client;
        })
        .catch((error) => {
            console.error('❌ MongoDB connection error:', error.message);
            throw error;
        });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDb() {
    try {
        const client = await clientPromise;
        // Extract DB name from URI if possible, or use a default. 
        // MongoDB URIs usually look like mongodb+srv://.../dbname?options
        return client.db();
    } catch (error: any) {
        console.error('Failed to get database connection:', error.message);
        throw new Error(`Database connection failed: ${error.message}`);
    }
}
