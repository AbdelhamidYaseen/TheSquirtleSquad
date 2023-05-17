import client, { dbName } from "../db";
import { iCaughtPokemon } from "../types";
import { iUser } from "./usersModel";

const getBuddyFromUser = async (userid: number): Promise<iCaughtPokemon | null> => {
    const res = await client.db(dbName).collection("users").findOne({ id: userid, "caughtPokemon.isBuddy": true });

    if (res) {
        const buddyPokemon: iCaughtPokemon = res.caughtPokemon.find((pokemon: iCaughtPokemon) => pokemon.isBuddy === true);
        return buddyPokemon;
    }

    return null;
};

const getAllCaughtPokemonFromuser = async (userid: number) : Promise<iCaughtPokemon[]> => {
    let res: iUser | null = await client.db(dbName).collection<iUser>("users").findOne<iUser>({id: userid});
    if(!res){
        return [];
    }
    return res.caughtPokemon;
}

// Exporteer hier al je funcites en interfaces die je hier hebt aangemaakt
export { getAllCaughtPokemonFromuser, getBuddyFromUser };