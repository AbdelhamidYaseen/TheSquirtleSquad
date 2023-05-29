import express from "express";
const router = express.Router();

import controller from '../controllers/battlerChoiceController';

const route = () => {
    router.get('/battlerChoice', controller.get);
    router.post('/battlerChoice', controller.post);
}

route();

export default router;