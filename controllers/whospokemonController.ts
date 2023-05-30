import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser , upgradePokemon} from '../models/caughtPokemonModel';

let userId: number=0;
// Maakt een object aan, je kan hier alle mogelijke express http methodes mee geven (get, post, ...)
const controller = {
    
    // Dit zorgt voor de logica voor de get http methode. Hier in kan je met je database praten, data manipuleren.
    // Maak dit ene async functie als je database requests doet
    get: async (req: express.Request, res: express.Response) => {
        try {
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
            const user : iUser = await getUserById(userId);
            const pokemonNumber : number = Math.floor(Math.random() * 150)+1;
            let buddyStatus = true;
            const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());
            const getBuddy = await getBuddyFromUser(userId);
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            const apiRes: iPokemon[] = await Promise.all(
                // Fetch 151 pokémon
                Array.from({ length: 151 }, (_,i) =>
                    
                    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((response) =>
                        response.json()
                    )
                )
            );

            const pokemonStats : iPokemon = {
                id: apiFetch.id,
                name: apiFetch.name,
                sprites: apiFetch.sprites,
                ability: apiFetch.ability,
                baseStats: apiFetch.stats,
                types: apiFetch.types
            }
            res.render('whospokemon', {user:user, pokemon:apiFetch,buddy : apiFetchBuddy,stats: pokemonStats, pokelist : apiRes, upgradePokemon, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus});
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: async(req: express.Request, res: express.Response) => {
        const statusSituationAttack = req.body.attackFormStatus;
        const statusSituationDefense = req.body.defenseFormStatus;
  
        if(statusSituationAttack == "false"){
            console.log("ATTACK UPGRADE CONTROLLER")
            upgradePokemon(userId,1);
        }
        if(statusSituationDefense == "false"){
            console.log("DEFENSE UPGRADE CONTROLLER")
            upgradePokemon(userId,2);
        }

        //RELOAD
        const user : iUser = await getUserById(userId);
        const pokemonNumber : number = Math.floor(Math.random() * 150)+1;
        let buddyStatus = true;
        const apiFetch : any = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());
        const getBuddy = await getBuddyFromUser(userId);
        const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
        const apiRes: iPokemon[] = await Promise.all(
            // Fetch 151 pokémon
            Array.from({ length: 151 }, (_,i) =>
                
                fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((response) =>
                    response.json()
                )
            )
        );

        const pokemonStats : iPokemon = {
            id: apiFetch.id,
            name: apiFetch.name,
            sprites: apiFetch.sprites,
            ability: apiFetch.ability,
            baseStats: apiFetch.stats,
            types: apiFetch.types
        }
        res.render('whospokemon', {user:user, pokemon:apiFetch,buddy : apiFetchBuddy,stats: pokemonStats, pokelist : apiRes, upgradePokemon, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus});
    }
}

// Dit exporteert de controller zodat we deze kunen gebruiken in een route.
export default controller;