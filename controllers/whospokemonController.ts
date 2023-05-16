import express from 'express';
import { getUserById, iUser } from '../models/usersModel';

// Maakt een object aan, je kan hier alle mogelijke express http methodes mee geven (get, post, ...)
const controller = {
    
    // Dit zorgt voor de logica voor de get http methode. Hier in kan je met je database praten, data manipuleren.
    // Maak dit ene async functie als je database requests doet
    get: async (req: express.Request, res: express.Response) => {
        
        try {
            // Log the names of all the users in the array
            const user : iUser = await getUserById(1);
            res.render('whospokemon', {user:user});
        } catch (err : any) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
        }
    },
}

// Dit exporteert de controller zodat we deze kunen gebruiken in een route.
export default controller;