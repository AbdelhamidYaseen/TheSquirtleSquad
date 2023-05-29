import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/homeController';

const route = () => {
    router.get('/home', authMiddelware, controller.get);
    router.post('/home', controller.post);
}

route();

export default router;