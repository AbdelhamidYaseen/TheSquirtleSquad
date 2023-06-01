import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser , addPokemonToUser, hasPokemonInDatabase, removePokemonFromUser} from '../models/caughtPokemonModel';
import { log } from 'console';
let queryPokemon="";
let userId: number=0;
const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            //get chosen pokemon from url query
            if(typeof(req.query.pokemonEnemy) !== 'undefined'){
                queryPokemon = req.query.pokemonEnemy.toString();
            }
            // get user id from cookies
            const cookie  = req.headers.cookie;
            if (cookie) {
                const cookies = cookie.split(';').map((cookieString) => cookieString.trim());
                const userIdCookie = cookies.find((cookieString) => cookieString.startsWith('userid='));
                
                if (userIdCookie) {
                    const userIdCookieValue = userIdCookie.split('=')[1];
                    userId = parseInt(userIdCookieValue);
                }
            }
            //get user and buddy information
            const user : iUser = await getUserById(userId);
            const getBuddy = await getBuddyFromUser(userId);
            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon}`).then((response)=> response.json());
            let buddyStatus = true;
            const apiFetchBuddy : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());

            //get enemy and buddy stats
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
            
            res.render('battler', {user:user, pokemon:apiFetch, buddy:apiFetchBuddy, stats:pokemonStats, buddyStats : buddyStats, buddyInfo : getBuddy, addPokemonToUser,getBuddyFromUser, hasPokemon:hasPokemonStatus, buddyStatus});  

        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: async(req: express.Request, res: express.Response) => {
        //adds pokemon to db after winning
        const pokemonId = req.body.pokemonId;
        const statusSituation = req.body.battleStatus;
        const hasPokemonDatabase = req.body.hasPokemonStatusInput;
        if(statusSituation == "false"){
            if(hasPokemonDatabase === "true"){
                removePokemonFromUser(userId, pokemonId);
            }
            addPokemonToUser(userId,pokemonId, false); 
        }
        
        //RELOAD
        const user : iUser = await getUserById(userId);
        const getBuddy = await getBuddyFromUser(userId);
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
        const hasPokemon = await hasPokemonInDatabase(user.id, pokemonStats.id);
        const hasPokemonStatus = String(hasPokemon);

        res.render('battler', {user:user, pokemon:apiFetch, buddy:apiFetchBuddy, stats:pokemonStats, buddyStats : buddyStats, buddyInfo : getBuddy, addPokemonToUser,getBuddyFromUser, hasPokemon:hasPokemonStatus, buddyStatus});  
    }
}

export default controller;