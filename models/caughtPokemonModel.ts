import client, { dbName } from "../db";
import { iCaughtPokemon } from "../types";
import {  iUser } from "./usersModel";

const getBuddyFromUser = async (userid: number): Promise<iCaughtPokemon | null> => {
    const res = await client.db(dbName).collection("users").findOne({ id: userid, "caughtPokemon.isBuddy": true });

    if (res) {
        const buddyPokemon: iCaughtPokemon = await res.caughtPokemon.find((pokemon: iCaughtPokemon) => pokemon.isBuddy === true);
        return buddyPokemon;
    }
    return null;
};
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

};
const getAllCaughtPokemonFromUser = async (userid: number) : Promise<iCaughtPokemon[]> => {
    let res: iUser | null = await client.db(dbName).collection<iUser>("users").findOne<iUser>({id: userid});
    if(!res){
        return [];
    }
    return res.caughtPokemon;
};
const removePokemonFromUser = async(userid: number, pokemonid: number)=>{
    const collection = client.db(dbName).collection("users");
    const document = await collection.findOne({id: userid});
    const pokemonIndex = document?.caughtPokemon.findIndex((pokemon:any)=>pokemon.pokemon_id == pokemonid);
    const filter = { id: userid };
    const update = {
      $unset: { [`caughtPokemon.${pokemonIndex}`]: 1 },
    };
    await collection.updateOne(filter, update);
    console.log(`Removed Pokémon at index ${pokemonIndex} for user ${userid}`);
    const nullUpdate = {$pull: {[`caughtPokemon`]: null}};
    await collection.updateOne(filter, nullUpdate)
    console.log(`Removed nulls`)
};
const addPokemonToUser = async (userId : number, pokemonId: number, buddyStatus: boolean) =>{

    const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then((response)=> response.json());
    let newPokemonObject: iCaughtPokemon ={
        pokemon_id: apiFetch.id,
        pokemon_name: apiFetch.name,
        pokemon_hp: apiFetch.stats[0].base_stat,
        pokemon_attack: apiFetch.stats[1].base_stat,
        pokemon_defense: apiFetch.stats[2].base_stat,
        pokemon_special_attack: apiFetch.stats[3].base_stat,
        pokemon_special_defense: apiFetch.stats[4].base_stat,
        pokemon_speed: apiFetch.stats[5].base_stat,
        isBuddy: buddyStatus
    }
    /*
    let pokemonObject : iCaughtPokemon[] = [
        {
        pokemon_id: 1,
        pokemon_hp: 150,
        pokemon_attack: 150,
        pokemon_defense: 150,
        pokemon_special_attack: 150,
        pokemon_special_defense: 150,
        pokeomn_speed: 150,
        isBuddy: false
        },
        {
            pokemon_id: 3,
            pokemon_hp: 150,
            pokemon_attack: 150,
            pokemon_defense: 150,
            pokemon_special_attack: 150,
            pokemon_special_defense: 150,
            pokeomn_speed: 150,
            isBuddy: false
            },
            {
                pokemon_id: 17,
                pokemon_hp: 150,
                pokemon_attack: 150,
                pokemon_defense: 150,
                pokemon_special_attack: 150,
                pokemon_special_defense: 150,
                pokeomn_speed: 150,
                isBuddy: true
                },
                {
                    pokemon_id: 20,
                    pokemon_hp: 150,
                    pokemon_attack: 150,
                    pokemon_defense: 150,
                    pokemon_special_attack: 150,
                    pokemon_special_defense: 150,
                    pokeomn_speed: 150,
                    isBuddy: false
                    }
]

    let userObject : iUser = {
        id: 1,
        username: "ArtesisPlantijn",
        password: "test", 
        caughtPokemon: pokemonObject
    
    }
    */
        const collection = client.db(dbName).collection("users");
      /*  
        await collection.deleteMany({});
        await collection.insertOne(userObject);
        */
        await collection.updateOne(
            {id: userId},
            {$push: {caughtPokemon: newPokemonObject}}
        )
        console.log("adding pokemon to user")
};
const upgradePokemon = async (userId: number, addition: number) =>{
    const collection = client.db(dbName).collection("users");
    const document = await collection.findOne({id: userId});
    const buddyIndex = document?.caughtPokemon.findIndex((pokemon: any) => pokemon.isBuddy === true);
    const arrayIndex = buddyIndex;
    const fieldToUpdate = `caughtPokemon.${arrayIndex}.pokemon_attack`;
    const fieldToUpdateDefense = `caughtPokemon.${arrayIndex}.pokemon_defense`;
    if(addition == 2){
        console.log("trying to add [defense]")
        await collection.updateOne(
            {id: userId, "caughtPokemon.isBuddy": true},
            {$inc: {[fieldToUpdateDefense]: 1, }},
            );    
    }
    if(addition == 1){
        console.log("trying to add [attack]")
    await collection.updateOne(
        {id: userId, "caughtPokemon.isBuddy": true},
        {$inc: {[fieldToUpdate]: 1, }},
        );
    }


};
const hasPokemonInDatabase = async(userid: number, pokemon: number) => {
    let response = await client.db(dbName).collection("users").findOne({ id: userid, "caughtPokemon.pokemon_id": pokemon });
    if(response){
        return true;
    }
    return false;
};
const changePokemonName = async(userid: number, pokemonid: number, name: string)=>{
    const collection = client.db(dbName).collection("users");
    const document = await collection.findOne({id: userid});
    const pokemonIndex = document?.caughtPokemon.findIndex((pokemon:any)=>pokemon.pokemon_id == pokemonid);
    const arrayIndex = pokemonIndex;
    const fieldToUpdate = `caughtPokemon.${arrayIndex}.pokemon_name`;
    await collection.updateOne(
        {id: userid},
        {$set: {[fieldToUpdate]: name}}
        )
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
}
// Exporteer hier al je funcites en interfaces die je hier hebt aangemaakt
export { getAllCaughtPokemonFromUser, getBuddyFromUser, addPokemonToUser, upgradePokemon , changeBuddyFromUser , hasPokemonInDatabase, removePokemonFromUser, changePokemonName, getCaughtPokemonFromUser};