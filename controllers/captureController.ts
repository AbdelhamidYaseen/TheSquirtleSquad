import express, { response } from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser, hasPokemonInDatabase , addPokemonToUser, removePokemonFromUser} from '../models/caughtPokemonModel';
import { changePokemonName } from '../models/caughtPokemonModel';
let queryPokemon="";
let userId: number=0;
const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            //Get Id from Cookies
            const cookie  = req.headers.cookie;
            if (cookie) {
                const cookies = cookie.split(';').map((cookieString) => cookieString.trim());
                const userIdCookie = cookies.find((cookieString) => cookieString.startsWith('userid='));
                
                if (userIdCookie) {
                    const userIdCookieValue = userIdCookie.split('=')[1];
                    userId = parseInt(userIdCookieValue);
                }
            }
            //Querry CaptureChoice
            if(typeof(req.query.pokemonCatch) !== 'undefined'){
                queryPokemon = req.query.pokemonCatch.toString();
            }
            
            //Get userdata
            const user : iUser = await getUserById(userId);
            //Apifetch
            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${queryPokemon}`).then((response)=> response.json());
            const getBuddy = await getBuddyFromUser(userId);
            let buddyStatus = true;
            //Api Pokemon call
            const apiFetchBuddy : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            const pokemonStats : iPokemon = {
                id: apiFetch.id,
                name: apiFetch.name,
                sprites: apiFetch.sprites,
                ability: apiFetch.ability,
                baseStats: apiFetch.stats,
            }
            //Get BuddyInfo from Api
            const buddyStats : iPokemon = {
                id: apiFetchBuddy.id,
                name: apiFetchBuddy.name,
                sprites: apiFetchBuddy.sprites,
                ability: apiFetchBuddy.ability,
                baseStats: apiFetchBuddy.stats,

            }
            //This function checks whether you have the Pokémon in your database.
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
            removePokemonFromUser(userId,pokemonIdRemove); 
        }
        
        if(statusSituationCapture == "false"){
            addPokemonToUser(userId,pokemonIdAdd,false); 
        }
        if(pokemonNameChangeStatus == "false"){
            console.log(`Function pokeName: ${pokemonName}\n Function pokeId ${pokemonNameChange}`);
            changePokemonName(userId, pokemonNameChange, pokemonName);
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
        //This checks if you have the Pokémon in your database. It is an await function.
        const hasPokemonStatus = await hasPokemonInDatabase(user.id, pokemonStats.id);


        res.render('capture', {user:user, pokemon : apiFetch, buddy : apiFetchBuddy,stats:pokemonStats, buddyStats : buddyStats, getBuddyFromUser, hasPokemonStatus, buddyInfo : getBuddy, buddyStatus});
    }
}

export default controller;