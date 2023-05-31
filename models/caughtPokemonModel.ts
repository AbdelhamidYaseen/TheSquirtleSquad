/*
Bevat alle functions jn verband met de connectie van de databank
    * Find
    * Add 
    * Remove
    * Change 
*/ 
import client, { dbName } from "../db";
import { iCaughtPokemon } from "../types";
import {  iUser } from "./usersModel";
//Haal gebruiker op aan de hand van de ingevoerde ID-variabele, als er geen gevonden wordt, retourneert het 'null'.
const getBuddyFromUser = async (userid: number): Promise<iCaughtPokemon | null> => {
    const res = await client.db(dbName).collection("users").findOne({ id: userid, "caughtPokemon.isBuddy": true });

    if (res) {
        const buddyPokemon: iCaughtPokemon = await res.caughtPokemon.find((pokemon: iCaughtPokemon) => pokemon.isBuddy === true);
        return buddyPokemon;
    }
    return null;
};
//Verander de buddy van de gebruiker (ID) naar een nieuwe Pokémon (ID).
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
//Retourneert een array van alle Pokémon die de gebruiker heeft.
const getAllCaughtPokemonFromUser = async (userid: number) : Promise<iCaughtPokemon[]> => {
    let res: iUser | null = await client.db(dbName).collection<iUser>("users").findOne<iUser>({id: userid});
    if(!res){
        return [];
    }
    return res.caughtPokemon;
};
//Stelt de array-index van de te verwijderen Pokémon in op NULL --> verwijdert vervolgens alle null-waarden van de gebruiker.
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
//Voegt pokemon[ID] toe aan gebruiker[ID] met de toegevoegde buddyStatus.
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
        const collection = client.db(dbName).collection("users");
        await collection.updateOne(
            {id: userId},
            {$push: {caughtPokemon: newPokemonObject}}
        )
        console.log("adding pokemon to user")
};
//Verhoogt de [DEFENSE] of [ATTACK] statistiek van je buddy.
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
//Controleert of pokemon[ID] zich in de gebruiker[ID] zijn caughtPokemon-array bevindt.
const hasPokemonInDatabase = async(userid: number, pokemon: number) => {
    let response = await client.db(dbName).collection("users").findOne({ id: userid, "caughtPokemon.pokemon_id": pokemon });
    if(response){
        return true;
    }
    return false;
};
//Verandert de naam van pokemon[ID] naar de invoerstring[name]. VEREIST DAT DE POKÉMON IN DE DATABASE STAAT!
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
//Haal de gevangen Pokémon [ID] op van gebruiker [ID].
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
export { getAllCaughtPokemonFromUser, getBuddyFromUser, addPokemonToUser, upgradePokemon , changeBuddyFromUser , hasPokemonInDatabase, removePokemonFromUser, changePokemonName, getCaughtPokemonFromUser};