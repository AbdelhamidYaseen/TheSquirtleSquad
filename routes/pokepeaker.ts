import express from "express";
const router = express.Router();

import controller from '../controllers/pokepeakerController';

const route = () => {
    router.get('/pokepeaker', controller.get);
}

route();

export default router;