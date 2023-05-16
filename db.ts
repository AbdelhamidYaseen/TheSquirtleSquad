import { MongoClient } from 'mongodb'

const url = 'mongodb+srv://squirtle:TO5wQQOJO41ViIKv@thesquirtlesquad.stbcj4h.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

export const dbName = 'itproject';

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