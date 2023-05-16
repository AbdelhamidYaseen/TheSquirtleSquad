import express from "express";
const router = express.Router();

import controller from '../controllers/pokedexController';

const route = () => {
    router.get('/pokedex', controller.get);
    router.get('/pokedex/:pagenumber', controller.getPage);
}

route();

export default router;