import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/battlerController';

const route = () => {
    router.get('/battler', authMiddelware, controller.get);
    router.post('/battler', controller.post);
}

route();

export default router;