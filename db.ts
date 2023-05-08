import { MongoClient } from 'mongodb'

const url = 'mongodb+srv://squirtle:TO5wQQOJO41ViIKv@thesquirtlesquad.stbcj4h.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

export const dbName = 'itproject';

(async() => {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
});

export default client;