import { ObjectId } from "mongodb";
import client, { dbName } from "../db";
import { iCaughtPokemon } from "../types";

// Declareer een interface voor een gebruiker; dit zou gelijk moeten zijn met welke kolommen er zijn in de database.
interface iUser {
    _id?: ObjectId, // Mongodb unique id
    id: number,
    username: string, // en een name veld in de database
    password: string, // en een name veld in de database
    caughtPokemon: iCaughtPokemon[],
}

// Maak de functie die je nodig hebt in dit geval om alle gebruikers uit de database op te vragen
const getAllUsers = async () => {
    // Schrijf hier gewoon simpel weg de mongodb statement
    let users: iUser[] = await client.db(dbName).collection("users").find<iUser>({}).toArray();
    return users;
}

const getUserById = async (id: number) : Promise<iUser> => {
    let user : iUser | null = await client.db(dbName).collection("users").findOne<iUser>({id: id});
    if(!user)
        throw new Error("No user found by that id");
    return user;
}

// Exporteer hier al je funcites en interfaces die je hier hebt aangemaakt
export { iUser, getUserById };