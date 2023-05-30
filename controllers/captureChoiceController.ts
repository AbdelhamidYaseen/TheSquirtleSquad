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
            let buddyStatus = true;
            // get user id from cookies
            const cookie = req.headers.cookie;
            if(typeof(cookie) !== 'undefined'){
                const cookiesplit = cookie?.split("=");
                userId = +cookiesplit[1];
            }
            const user : iUser = await getUserById(userId);
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
            res.render('captureChoice', {user:user, buddy : apiFetchBuddy, pokelist : apiRes, getBuddyFromUser, buddyStatus, buddyInfo : getBuddy});
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: async(req: express.Request, res: express.Response) => {
        const catchChoice = req.body.pokemon;
        res.redirect(`/capture?pokemonCatch=${catchChoice}`);
    }
}

// Dit exporteert de controller zodat we deze kunen gebruiken in een route.
export default controller;