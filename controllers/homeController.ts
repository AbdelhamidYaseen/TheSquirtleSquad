import express from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser } from '../models/caughtPokemonModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            if(await getBuddyFromUser(2) == null){
                console.log("NO BUDDY")
                res.render('home', {user:user, getBuddyFromUser});
            }
            else{
                console.log("WE HAVE A BUDDY")
                const getBuddy = await getBuddyFromUser(2);
                const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());
                res.render('home', {user:user,buddy:apiFetchBuddy, getBuddyFromUser});
            }

        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
    post: (req: express.Request, res: express.Response) => {
        test();
    }
}

const test = () => {
    console.log(test);
}

export default controller;