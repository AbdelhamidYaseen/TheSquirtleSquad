import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/pokedexController';

const route = () => {
    router.get('/pokedex', authMiddelware, controller.get);
    router.get('/pokedex/:pagenumber', authMiddelware, controller.getPage);
}

route();

export default router;