import express from "express";
const router = express.Router();

import controller from '../controllers/homeController';

const route = () => {
    router.get('/home', controller.get);
    router.post('/home', controller.post);
}

route();

export default router;