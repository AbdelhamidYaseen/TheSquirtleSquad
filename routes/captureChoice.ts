import express from "express";
const router = express.Router();
import authMiddelware from '../routes/index'

import controller from '../controllers/captureChoiceController';

const route = () => {
    router.get('/captureChoice', authMiddelware, controller.get);
    router.post('/captureChoice', controller.post);
}

route();

export default router;