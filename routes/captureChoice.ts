import express from "express";
const router = express.Router();

import controller from '../controllers/captureChoiceController';

const route = () => {
    router.get('/captureChoice', controller.get);
    router.post('/captureChoice', controller.post);
}

route();

export default router;