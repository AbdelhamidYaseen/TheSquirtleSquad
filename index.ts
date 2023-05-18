import express, { Router } from "express";
import ejs from "ejs";
import * as path from 'path';
import * as fs from 'fs';
import bodyParser from "body-parser";

const registerRoutes = (): Router => {
    const router = Router();
    const dir = path.join(__dirname, 'routes');

    fs.readdirSync(dir).forEach(f => {
        if (f.endsWith('.ts')) {
            console.log('added ' + f);
            const route = require(path.join(dir, f)).default;
            router.use(route);
        }
    });
    return router;
}

const app = express();
app.set("port", 3000);
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(registerRoutes());
app.listen(app.get("port"), () => {
    console.log("[Server] running on http://localhost:" + app.get("port"));
});
