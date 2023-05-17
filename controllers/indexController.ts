import express from 'express';
import { iPokemon } from '../types';
import { getBuddyFromUser } from '../models/caughtPokemonModel';
import { getUserById, iUser } from '../models/usersModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        const user : iUser = await getUserById(1);
        const pokemonNumber : number = Math.floor(Math.random() * 150);
        const apiFetch : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`).then((response)=> response.json());

        const getBuddy = await getBuddyFromUser(1);
        const apiFetchBuddy : iPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${getBuddy?.pokemon_id}`).then((response) => response.json());

        res.render('index',{buddy:apiFetchBuddy,user:user, pokemon : apiFetch});
    },
    post: (req: express.Request, res: express.Response) => {
        test();
    }
}

const test = () => {
    console.log(test);
}

export default controller;