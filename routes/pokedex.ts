import express from "express";
const router = express.Router();

import controller from '../controllers/pokedexController';

const route = () => {
    router.get('/pokedex', controller.get);
    router.post('/addPokemon', controller.post);
}

route();

export default router;