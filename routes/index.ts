import express from "express";
const router = express.Router();

import controller from '../controllers/indexController';

const route = () => {
    router.get('/', controller.get);
    router.post('/', controller.post);
}

route();

export const authMiddelware = (req: express.Request, res:express.Response, next:express.NextFunction): void => {
    /*check if cookie is valid, if so, redirected to asked page, otherwise send back to landingpage/index*/
    const cookie  = req.headers.cookie;
    if (cookie) {
        const cookies = cookie.split(';').map((cookieString) => cookieString.trim());
        const userIdCookie = cookies.find((cookieString) => cookieString.startsWith('userid='));
        
        if (userIdCookie) {
          const userId = userIdCookie.split('=')[1];
          next();
        }else{
            return res.redirect('/?loggedIn=false');
        }
    }else{
        return res.redirect('/?loggedIn=false');
    }
};

export default router;