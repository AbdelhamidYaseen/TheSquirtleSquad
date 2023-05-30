import express from "express";
const router = express.Router();
import authMiddelware from '../routes/index'

import controller from '../controllers/battlerChoiceController';

const route = () => {
    router.get('/battlerChoice', authMiddelware, controller.get);
    router.post('/battlerChoice', controller.post);
}

route();

export default router;