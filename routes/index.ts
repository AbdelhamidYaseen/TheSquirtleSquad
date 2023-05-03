import express from "express";
const router = express.Router();

import controller from '../controllers/indexController';

const route = () => {
    router.get('/', controller.get);
    router.post('/', controller.post);
}

route();

export default router;