import express from 'express'; 
import { getAllUsers } from '../models/exampleModel'; // Importeer de getAllUsers functie van de model
import type { iUserExample } from '../models/exampleModel'; // Importeer het type dat bij de user hoort

// Maakt een object aan, je kan hier alle mogelijke express http methodes mee geven (get, post, ...)
const controller = {
    // Dit zorgt voor de logica voor de get http methode. Hier in kan je met je database praten, data manipuleren.
    // Maak dit ene async functie als je database requests doet
    get: async (req: express.Request, res : express.Response) => {
        // Sla alle gebruikers op in de variable allUsers met de interface iUserExample
        const allUsers : iUserExample[] = await getAllUsers();
        // Print gewoon alle namen van de gebruikers die in de database zitten
        for(const user of allUsers){
            console.log(user.name);
        }
        res.render('pokedex');
    },
}

// Dit exporteert de controller zodat we deze kunen gebruiken in een route.
export default controller;