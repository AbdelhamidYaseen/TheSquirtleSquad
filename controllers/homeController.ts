import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser, changePokemonName, addPokemonToUser, getAllCaughtPokemonFromUser } from '../models/caughtPokemonModel';
import { changeBuddyFromUser } from '../models/caughtPokemonModel';

let userId: number=0;

const controller = {
    get: async (req: express.Request, res : express.Response) => {
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
            let buddyStatus = true;
            const allCaughtPokemon = await getAllCaughtPokemonFromUser(userId);
            if(allCaughtPokemon.length==0){
                buddyStatus = false;
                const apiFetchBulbasaur : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${1}`).then((response) => response.json());
                const apiFetchCharmander : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${4}`).then((response) => response.json());
                const apiFetchSquirtle : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${7}`).then((response) => response.json());
                res.render('home', {user:user, buddyStatus, bulbasaur: apiFetchBulbasaur, charmander: apiFetchCharmander, squirtle: apiFetchSquirtle});
            }
            else{
                const getBuddy = await getBuddyFromUser(userId);
                const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
                res.render('home', {user:user,buddy:apiFetchBuddy, getBuddyFromUser, changePokemonName,buddyInfo : getBuddy, buddyStatus});
            }

        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: async(req: express.Request, res: express.Response) => {
        const starterToAdd = req.body.addSquirtle;
        
        switch (starterToAdd) {
            case "bulbasaur":
                addPokemonToUser(userId,1,true);
                break;
            case "charmander":
                addPokemonToUser(userId,4,true);
                break;
            case "squirtle":
                addPokemonToUser(userId,7,true);
                break;
            default:
              break;
          }
        //RELOAD
        // Log the names of all the users in the array
        const user : iUser = await getUserById(userId);
        let buddyStatus = true;
        if(await getBuddyFromUser(userId) === null){
            buddyStatus = false;
            const apiFetchSquirtle : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${7}`).then((response) => response.json());

            res.render('home', {user:user, buddyStatus, squirtle: apiFetchSquirtle});
        }else{
            const getBuddy = await getBuddyFromUser(userId);
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
            res.render('home', {user:user,buddy:apiFetchBuddy, getBuddyFromUser, changePokemonName,buddyInfo : getBuddy, buddyStatus});
        }

    }
}

export default controller;