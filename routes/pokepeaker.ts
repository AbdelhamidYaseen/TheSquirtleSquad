import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/pokepeakerController';

const route = () => {
    router.get('/pokepeaker/:pokemonId', controller.get);
    router.get('/setBuddy/:pokemonId', controller.setBuddy);
}

route();

export default router;