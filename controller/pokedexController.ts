import express from 'express';

const controller = {
    get: (req: express.Request, res : express.Response) => {
        res.render('pokedex');
    },
    post: (req: express.Request, res: express.Response) => {
        test();
    }
}

const test = () => {
    console.log(test);
}

export default controller;