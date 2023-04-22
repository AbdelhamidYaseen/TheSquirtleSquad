import express from "express";
const router = express.Router();

// hier importeer je jou controller die je hebt gemaakt
import controller from '../controller/exampleController';

// Hier zeg je welke routes die heeft.
const route = () => {
    router.get('/exampleRoute', controller.get);
    // router.post('/examplePostRoute', conroller.post);
    // router.put('/examplePutRoute', controller.put);
    // router.delete('exampleDeleteRoute', controller.delete);
}

route();

export default router;