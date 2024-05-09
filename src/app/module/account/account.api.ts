import { validate } from "../../../app/middleware/validator";
import { Service } from "../../index";
import express, { Express, Request, Response } from "express";
import Validator, { Login, Register } from './account.model';
import { env } from "../../../lib/env";
import { AccountStore } from "./account.store";
import jwt from 'jsonwebtoken';
import ms from "ms";

export class AccountService implements Service {

    private SECRET_KEY = env.get('JWT_SIGNING_KEY').toString('rahasia')
    private TOKEN_EXP = env.get('JWT_EXPIRATION').toString('1h')
    private REFRESH_TOKEN_EXP = env.get('JWT_REFRESH_TOKEN_EXPIRATION').toString('1d')

    private store = new AccountStore()

    constructor(private app: Express) {}

    hello = async (req: Request, res: Response) => {
        res.status(200).send({
            code: 200,
            message: 'Hello',
            data: null
        })
    }

    setExpiration(ms: number): Date {
        const now = new Date().getTime()
        return new Date(now + ms)
    }

    register = async (req: Request, res: Response) => {
        try {
            const payload = req.body as Register
            const user = await this.store.create(payload)

            const { token, refreshToken } = this.generateToken(user.id)
            res.status(201)
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: req.secure ? 'none' : 'lax',
                    secure: req.secure,
                    expires: this.setExpiration(ms(this.REFRESH_TOKEN_EXP))
                })
                .send({
                    code: 201,
                    message: 'Created',
                    data: { token }
                })
        } catch (error) {
            res.status(500).send({
                code: 500,
                message: `${error}`,
                data: null
            })
        }
    }

    login = async (req: Request, res: Response) => {
        try {  
            const payload = req.body as Login
            const user = await this.store.login(payload)

            if (!user) {
                res.status(400).send({
                    code: 400,
                    message: 'Wrong email or password',
                    data: null
                })

                return
            }

            const { token, refreshToken } = this.generateToken(user.id)
            const data = { 
                token, 
                user: {
                    name: user.name,
                    email: user.email
                }
            }

            res.status(200)
                .cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    sameSite: req.secure ? 'none' : 'lax',
                    secure: req.secure,
                    expires: this.setExpiration(ms(this.REFRESH_TOKEN_EXP))
                })
                .send({
                    code: 200,
                    message: 'Ok',
                    data: data                
                })
        } catch (error) {
             res.status(500).send({
                code: 500,
                message: `${error}`,
                data: null
            })
        }
    }

    generateToken(userId: number): { token: string, refreshToken: string} {
        const token = jwt.sign({user: userId}, this.SECRET_KEY, {
            expiresIn: this.TOKEN_EXP
        })

        const refreshToken = jwt.sign({ user: userId }, this.SECRET_KEY, {
            expiresIn: this.REFRESH_TOKEN_EXP
        })

        return { token, refreshToken }
    }
    
    createRoutes(): void {
        const v1 = express.Router()

        v1.get('/', this.hello)
        v1.post('/register', validate(Validator.register), this.register)
        v1.post('/login', validate(Validator.login), this.login)

        this.app.use('/api/v1', v1)
    }
}