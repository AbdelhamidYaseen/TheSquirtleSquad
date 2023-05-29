import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/pokepeakerController';

const route = () => {
    router.get('/pokepeaker', authMiddelware, controller.get);
}

route();

export default router;