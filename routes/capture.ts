import express from "express";
const router = express.Router();

import controller from '../controllers/captureController';

const route = () => {
    router.get('/capture', controller.get);
    router.post('/capture', controller.post);
}

route();

export default router;