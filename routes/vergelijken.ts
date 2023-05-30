import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/vergelijkenController';

const route = () => {
    router.get('/vergelijken', authMiddelware, controller.get);
}

route();

export default router;