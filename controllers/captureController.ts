import express, { response } from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser, hasPokemonInDatabase , addPokemonToUser, removePokemonFromUser} from '../models/caughtPokemonModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            const pokemonNumber : number = Math.floor(Math.random() * 150)+1;
            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());
            const getBuddy = await getBuddyFromUser(1);
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
            //dit checked of je de pokemon in je database hebt --> is een await function
            const hasPokemonStatus = await hasPokemonInDatabase(user.id, pokemonStats.id);


            res.render('capture', {user:user, pokemon : apiFetch, buddy : apiFetchBuddy,stats:pokemonStats, buddyStats : buddyStats, getBuddyFromUser, hasPokemonStatus});

            
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }

    },
    post: async (req: express.Request, res: express.Response) => {
        const pokemonIdRemove = req.body.pokemonIdRemove;
        const pokemonIdAdd = req.body.pokemonIdAdd;
        console.log(pokemonIdAdd)
        const statusSituationRemove = req.body.pokemonIdRemoveStatus;
        const statusSituationCapture = req.body.pokemonIdAddStatus;
        
        if(statusSituationRemove == "false"){
            removePokemonFromUser(1,pokemonIdRemove); 
        }
        
        if(statusSituationCapture == "false"){
        addPokemonToUser(1,pokemonIdAdd); 
        }


        //RELOAD
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            const pokemonNumber : number = Math.floor(Math.random() * 150)+1;
            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());
            const getBuddy = await getBuddyFromUser(1);
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
            //dit checked of je de pokemon in je database hebt --> is een await function
            const hasPokemonStatus = await hasPokemonInDatabase(user.id, pokemonStats.id);


            res.render('capture', {user:user, pokemon : apiFetch, buddy : apiFetchBuddy,stats:pokemonStats, buddyStats : buddyStats, getBuddyFromUser, hasPokemonStatus});


    }
}

export default controller;