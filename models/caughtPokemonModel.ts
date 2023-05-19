import client, { dbName } from "../db";
import { iCaughtPokemon, iPokemon } from "../types";
import { getUserById, iUser } from "./usersModel";

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

const addPokemonToUser = async (userId : number, pokemonId: number) =>{

    const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then((response)=> response.json());
    let newPokemonObject: iCaughtPokemon ={
        pokemon_id: apiFetch.id,
        pokemon_hp: apiFetch.stats[0].base_stat,
        pokemon_attack: apiFetch.stats[1].base_stat,
        pokemon_defense: apiFetch.stats[2].base_stat,
        pokemon_special_attack: apiFetch.stats[3].base_stat,
        pokemon_special_defense: apiFetch.stats[4].base_stat,
        pokeomn_speed: apiFetch.stats[5].base_stat,
        isBuddy: false
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
        
}   

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


}
const getBuddyStats = async (user : number) =>{
}
// Exporteer hier al je funcites en interfaces die je hier hebt aangemaakt
export { getAllCaughtPokemonFromuser, getBuddyFromUser, addPokemonToUser, upgradePokemon ,getBuddyStats };