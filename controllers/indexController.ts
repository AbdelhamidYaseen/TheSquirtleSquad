import express from 'express';
import { iPokemon } from '../types';
import { getBuddyFromUser } from '../models/caughtPokemonModel';
import { getUserById, iUser } from '../models/usersModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        const user : iUser = await getUserById(1);

        res.render('index',{ getBuddyFromUser});
    },
    post: (req: express.Request, res: express.Response) => {
        test();
    }
}

const test = () => {
    console.log(test);
}

export default controller;