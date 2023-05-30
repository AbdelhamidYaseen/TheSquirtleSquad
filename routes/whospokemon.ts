import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/whospokemonController';

const route = () => {
    router.get('/whospokemon', authMiddelware, controller.get);
    router.post('/whospokemon', controller.post);

}

route();

export default router;