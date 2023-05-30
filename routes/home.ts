import express from "express";
import { authMiddelware } from "./index";
const router = express.Router();



import controller from '../controllers/homeController';

const route = () => {
    router.get('/home', authMiddelware, controller.get);
    router.post('/home', controller.post);
}

route();

export default router;