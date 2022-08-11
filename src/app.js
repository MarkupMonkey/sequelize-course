import express from 'express';
import environment from './config/environment';
import logger from 'morgan';
import errorsMiddleware from './middlewares/errors';
import { v1Routes } from './controllers';
import bodyParser from 'body-parser';

export default class App {
    constructor() {
        this.app = express();
        this.app.use(
            logger('dev', { skip: (req, res) => environment.nodeEnv === 'test' })
        );
        this.app.use(express.json()) // for parsing application/json
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.setRoutes();
    }

    // format that class will had
    setRoutes() {
        this.app.use('/v1', v1Routes);
        this.app.use(errorsMiddleware);
    }

    getApp() {
        return this.app;
    }

    listen() {
        const { port } = environment;
        this.app.listen(port, () => {
            console.log(`Listening at port ${port}`)
        });
    }
}
