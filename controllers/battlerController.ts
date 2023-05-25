import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser , addPokemonToUser, hasPokemonInDatabase, removePokemonFromUser} from '../models/caughtPokemonModel';

// Maakt een object aan, je kan hier alle mogelijke express http methodes mee geven (get, post, ...)
const controller = {
    
    // Dit zorgt voor de logica voor de get http methode. Hier in kan je met je database praten, data manipuleren.
    // Maak dit ene async functie als je database requests doet
    get: async (req: express.Request, res: express.Response) => {
        
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            const getBuddy = await getBuddyFromUser(1);
            let pokemonNumber : number = Math.floor(Math.random() * 150)+1;
            while(pokemonNumber == getBuddy?.pokemon_id){
                console.log("random pokemon was buddy");
                console.log(`buddy_id: ${getBuddy?.pokemon_id}\nrandom_nmbr: ${pokemonNumber}`);
                pokemonNumber = Math.floor(Math.random() * 150)+1;

            }


            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());
            const apiFetchBuddy : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());

            const pokemonStats : iPokemon = {
                id: apiFetch.id,
                name: apiFetch.name,
                sprites: apiFetch.sprites,
                ability: apiFetch.ability,
                baseStats: apiFetch.stats,
            }
            const buddyStats : iPokemon = {
                id: apiFetchBuddy.id,
                name: apiFetchBuddy.name,
                sprites: apiFetchBuddy.sprites,
                ability: apiFetchBuddy.ability,
                baseStats: apiFetchBuddy.stats,

            }
            const hasPokemon = await hasPokemonInDatabase(user.id, pokemonStats.id);
            const hasPokemonStatus = String(hasPokemon);
            console.log(hasPokemonStatus);
            res.render('battler', {user:user, pokemon:apiFetch, buddy:apiFetchBuddy, stats:pokemonStats, buddyStats : buddyStats, buddyInfo : getBuddy, addPokemonToUser,getBuddyFromUser, kaas:hasPokemonStatus});  

        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: async(req: express.Request, res: express.Response) => {
        
        const pokemonId = req.body.pokemonId;
        const statusSituation = req.body.battleStatus;
        const hasPokemonDatabase = req.body.hasPokemonStatusInput;
        console.log(`hasPokemonStatus: ${hasPokemonDatabase}`);
        if(statusSituation == "false"){
            if(hasPokemonDatabase === "true"){
                removePokemonFromUser(1, pokemonId);
            }
        addPokemonToUser(1,pokemonId); 
        }
        
        //RELOAD
            const user : iUser = await getUserById(1);
            const getBuddy = await getBuddyFromUser(1);
            let pokemonNumber : number = Math.floor(Math.random() * 150)+1;
            while(pokemonNumber == getBuddy?.pokemon_id){
                console.log("random pokemon was buddy");
                console.log(`buddy_id: ${getBuddy?.pokemon_id}\nrandom_nmbr: ${pokemonNumber}`);
                pokemonNumber = Math.floor(Math.random() * 150)+1;

            }


            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());
            const apiFetchBuddy : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());

            const pokemonStats : iPokemon = {
                id: apiFetch.id,
                name: apiFetch.name,
                sprites: apiFetch.sprites,
                ability: apiFetch.ability,
                baseStats: apiFetch.stats,
            }
            const buddyStats : iPokemon = {
                id: apiFetchBuddy.id,
                name: apiFetchBuddy.name,
                sprites: apiFetchBuddy.sprites,
                ability: apiFetchBuddy.ability,
                baseStats: apiFetchBuddy.stats,

            }
            const hasPokemon = await hasPokemonInDatabase(user.id, pokemonStats.id);
            const hasPokemonStatus = String(hasPokemon);
            console.log(hasPokemonStatus);
            res.render('battler', {user:user, pokemon:apiFetch, buddy:apiFetchBuddy, stats:pokemonStats, buddyStats : buddyStats, buddyInfo : getBuddy, addPokemonToUser,getBuddyFromUser, kaas:hasPokemonStatus});  

        }



}

// Dit exporteert de controller zodat we deze kunen gebruiken in een route.
export default controller;