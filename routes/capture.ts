import express from "express";
const router = express.Router();

import authMiddelware from '../routes/index'

import controller from '../controllers/captureController';

const route = () => {
    router.get('/capture', authMiddelware, controller.get);
    router.post('/capture', controller.post);
}

route();

export default router;