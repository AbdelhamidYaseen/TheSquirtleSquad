import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser , upgradePokemon} from '../models/caughtPokemonModel';

let userId: number=0;
const controller = {
    get: async (req: express.Request, res: express.Response) => {
        
        try {
            let buddyStatus = true;
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
            //buddy and user information
            const user : iUser = await getUserById(userId);
            const getBuddy = await getBuddyFromUser(userId);
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            // Fetch 151 pokémon
            const apiRes: iPokemon[] = await Promise.all(
                Array.from({ length: 151 }, (_,i) =>
                    
                    fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((response) =>
                        response.json()
                    )
                )
            );
            res.render('battlerChoice', {user:user, buddy : apiFetchBuddy, pokelist : apiRes, getBuddyFromUser, buddyStatus, buddyInfo : getBuddy});
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: async(req: express.Request, res: express.Response) => {
        const battleChoice = req.body.pokemon;
        //redirect to battle page with url query
        res.redirect(`/battler?pokemonEnemy=${battleChoice}`);
    }
}

export default controller;