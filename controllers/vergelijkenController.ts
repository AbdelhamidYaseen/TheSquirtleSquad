import express from 'express'; 
import { getUserById, iUser } from '../models/usersModel';
import { getBuddyFromUser } from '../models/caughtPokemonModel';
import { iPokemon } from '../types';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            const getBuddy = await getBuddyFromUser(1);
            let buddyStatus = true;
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());


            res.render('vergelijken', {user:user,buddy : apiFetchBuddy, getBuddyFromUser, buddyInfo : getBuddy, buddyStatus});
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
}

export default controller;