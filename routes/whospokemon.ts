import express from "express";
const router = express.Router();

import controller from '../controllers/whospokemonController';

const route = () => {
    router.get('/whospokemon', controller.get);
}

route();

export default router;