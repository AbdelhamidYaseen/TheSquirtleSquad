import express from "express";
const router = express.Router();

import controller from '../controllers/vergelijkenController';

const route = () => {
    router.get('/vergelijken', controller.get);
}

route();

export default router;