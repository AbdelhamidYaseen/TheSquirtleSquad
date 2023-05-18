import express from "express";
const router = express.Router();

import controller from '../controllers/battlerController';

const route = () => {
    router.get('/battler', controller.get);
    
}

route();

export default router;