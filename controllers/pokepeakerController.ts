import express from 'express'; 
import { getUserById, iUser } from '../models/usersModel';

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            res.render('pokepeaker', {user:user});
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }

    },
}

export default controller;