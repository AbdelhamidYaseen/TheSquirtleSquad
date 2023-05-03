import express from 'express'; 

const controller = {
    get: async (req: express.Request, res : express.Response) => {
        res.render('pokepeaker');
    },
}

export default controller;