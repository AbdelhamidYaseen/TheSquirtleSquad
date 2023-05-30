import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/vergelijkenController';

const route = () => {
    router.get('/vergelijken', controller.get);
    router.post('/vergelijken', controller.changePokemon);
}

route();

export default router;