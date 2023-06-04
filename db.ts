import { MongoClient } from 'mongodb'

// MongoDB connection URL
const url = 'mongodb+srv://squirtle:TO5wQQOJO41ViIKv@thesquirtlesquad.stbcj4h.mongodb.net/?retryWrites=true&w=majority';
// Create a new MongoClient instance
const client = new MongoClient(url);

// Database name
export const dbName = 'itproject';

// Connect to the MongoDB server
(async () => {
    try {
        await client.connect().then(() => {
            console.log('Connected successfully to server');
        });
    } catch (e: any) {
        console.error(e.message);
    }
})();

export default client;