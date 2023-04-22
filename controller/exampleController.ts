import express from 'express'; 

// Maakt een object aan, je kan hier alle mogelijke express http methodes mee geven (get, post, ...)
const controller = {
    // Dit zorgt voor de logica voor de get http methode. Hier in kan je met je database praten, data manipuleren.
    get: (req: express.Request, res : express.Response) => {
        res.render('pokedex');
    },
}

// Dit exporteert de controller zodat we deze kunen gebruiken in een route.
export default controller;