import express, { response } from 'express';
import { getUserById, iUser } from '../models/usersModel';
import { iPokemon } from '../types';
import { getBuddyFromUser, changeBuddyFromUser } from '../models/caughtPokemonModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            const pokemonNumber : number = Math.floor(Math.random() * 150);
            const apiFetch : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());

            let chances = 3;
            
            const getBuddy = await getBuddyFromUser(1);
            const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());

            res.render('capture', {user:user, pokemon : apiFetch, chances, buddy : apiFetchBuddy, getBuddyFromUser});

            
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