import { Service } from "../../index";
import express, { Express, Request, Response } from "express";

export class AccountService implements Service {

    constructor(private app: Express) {}

    hello = async (req: Request, res: Response) => {
        res.status(200).send({
            code: 200,
            message: 'Hello',
            data: null
        })
    }
    
    createRoutes(): void {
        const v1 = express.Router()

        v1.get('/', this.hello)

        this.app.use('/api/v1', v1)
    }
}