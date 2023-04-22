import express from "express";
const router = express.Router();

import controller from '../controller/pokedexController';

const route = () => {
    router.get('/pokedex', controller.get);
    router.post('/addPokemon', controller.post);
}

route();

export default router;