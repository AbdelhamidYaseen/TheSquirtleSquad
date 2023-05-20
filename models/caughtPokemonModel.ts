import client, { dbName } from "../db";
import { iCaughtPokemon } from "../types";
import { iUser } from "./usersModel";

const changeBuddyFromUser = async (userId: number,newPokemonId: number) =>{
    const collection = client.db(dbName).collection("users");
    const document = await collection.findOne({id: userId});
    const buddyIndex = document?.caughtPokemon.findIndex((pokemon: any) => pokemon.isBuddy === true);
    const newBuddyIndex = document?.caughtPokemon.findIndex((pokemon: any) => pokemon.pokemon_id == newPokemonId);
    const arrayIndex = buddyIndex;
    const arrayIndexNew = newBuddyIndex;
    const oldBuddy = `caughtPokemon.${arrayIndex}.isBuddy`;
    const newBuddy = `caughtPokemon.${arrayIndexNew}.isBuddy`;
    await collection.updateOne(
        {id: userId, "caughtPokemon.isBuddy": true},
        {$set: {[oldBuddy]: false, }},
        );    
        await collection.updateOne(
            {id: userId, "caughtPokemon.isBuddy": false},
            {$set: {[newBuddy]: true, }},
            );    

}

const getAllCaughtPokemonFromUser = async (userid: number): Promise<iCaughtPokemon[]> => {
    let res: iUser | null = await client.db(dbName).collection<iUser>("users").findOne<iUser>({ id: userid });
    if (!res) {
        return [];
    }
    return res.caughtPokemon;
}

const getCaughtPokemonFromUser = async (userid: number, pokemonId: number): Promise<iCaughtPokemon | null> => {
    const res = await client
        .db(dbName)
        .collection("users")
        .findOne({ id: userid });

    if (res) {
        const caughtPokemon: iCaughtPokemon = res.caughtPokemon.find(
            (pokemon: iCaughtPokemon) => Number(pokemon.pokemon_id) === pokemonId
        );

        return caughtPokemon ? caughtPokemon : null;
    }

    return null;
};

const getBuddyFromUser = async (userid: number): Promise<iCaughtPokemon | null> => {
    const res = await client.db(dbName).collection("users").findOne({ id: userid, "caughtPokemon.isBuddy": true });

    if (res) {
        const buddyPokemon: iCaughtPokemon = res.caughtPokemon.find((pokemon: iCaughtPokemon) => pokemon.isBuddy === true);
        return buddyPokemon;
    }

    return null;
};

// Exporteer hier al je funcites en interfaces die je hier hebt aangemaakt
export { changeBuddyFromUser, getAllCaughtPokemonFromUser, getCaughtPokemonFromUser, getBuddyFromUser};