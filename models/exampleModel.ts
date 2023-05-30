import { ObjectId } from "mongodb";
import client, { dbName } from "../db";

// Declareer een interface voor een gebruiker; dit zou gelijk moeten zijn met welke kolommen er zijn in de database.
interface iUserExample {
    _id?: ObjectId, // Mongodb unique id
    id: number,
    gebruikersnaam: string, // en een name veld in de database
    password: string, // en een name veld in de database
}

// Maak de functie die je nodig hebt in dit geval om alle gebruikers uit de database op te vragen
const getAllUsers = async () => {
    // Schrijf hier gewoon simpel weg de mongodb statement
    let users: iUserExample[] = await client.db(dbName).collection("users").find<iUserExample>({}).toArray();
    return users;
}

// Exporteer hier al je funcites en interfaces die je hier hebt aangemaakt
export { iUserExample, getAllUsers };