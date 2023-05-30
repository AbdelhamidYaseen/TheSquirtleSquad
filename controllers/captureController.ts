import express, { response } from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser, hasPokemonInDatabase , addPokemonToUser, removePokemonFromUser} from '../models/caughtPokemonModel';
import { changePokemonName } from '../models/caughtPokemonModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            // Log the names of all the users in the array
            const queryPokemon = req.query.pokemonCatch;
            const user : iUser = await getUserById(1);
            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon}`).then((response)=> response.json());
            const getBuddy = await getBuddyFromUser(1);
            let buddyStatus = true;
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


            res.render('capture', {user:user, pokemon : apiFetch, buddy : apiFetchBuddy,stats:pokemonStats, buddyStats : buddyStats, getBuddyFromUser, hasPokemonStatus, buddyInfo : getBuddy, buddyStatus});

            
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }

    },
    post: async (req: express.Request, res: express.Response) => {
        const pokemonIdRemove = req.body.pokemonIdRemove;
        const pokemonIdAdd = req.body.pokemonIdAdd;
        const statusSituationRemove = req.body.pokemonIdRemoveStatus;
        const statusSituationCapture = req.body.pokemonIdAddStatus;
        const pokemonNameChangeStatus = req.body.pokemonNameChangeStatus;
        const pokemonNameChange = req.body.pokemonNameChange;
        let pokemonName : string = req.body.nameChange;

        if(statusSituationRemove == "false"){
            removePokemonFromUser(1,pokemonIdRemove); 
        }
        
        if(statusSituationCapture == "false"){
            addPokemonToUser(1,pokemonIdAdd,false); 
        }
        if(pokemonNameChangeStatus == "false"){
            console.log(`Function pokeName: ${pokemonName}\n Function pokeId ${pokemonNameChange}`);
            changePokemonName(1, pokemonNameChange, pokemonName);
        }


        //RELOAD
        const queryPokemon = req.query.pokemonCatch;
        const user : iUser = await getUserById(1);
        const getBuddy = await getBuddyFromUser(1);
        let buddyStatus = true;
        const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon}`).then((response)=> response.json());
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


        res.render('capture', {user:user, pokemon : apiFetch, buddy : apiFetchBuddy,stats:pokemonStats, buddyStats : buddyStats, getBuddyFromUser, hasPokemonStatus, buddyInfo : getBuddy, buddyStatus});

    }
}

export default controller;