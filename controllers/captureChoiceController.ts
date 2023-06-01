import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser , upgradePokemon} from '../models/caughtPokemonModel';

let userId: number=0;
const controller = {
    get: async (req: express.Request, res: express.Response) => {
        try {
            let buddyStatus = true;
            //get user id from cookie
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

            //get buddy and pokemon list from api
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
    //redirects to capture with url query
    post: async(req: express.Request, res: express.Response) => {
        const catchChoice = req.body.pokemon;
        res.redirect(`/capture?pokemonCatch=${catchChoice}`);
    }
}
export default controller;