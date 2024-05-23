import { Express, Request, Response, NextFunction } from 'express'
import { User } from '../module/account/account.model'
import { env } from '../../lib/env'
import jwt from 'jsonwebtoken'
import { AccountStore } from '../module/account/account.store'

declare global {
    namespace Express {
        interface Request {
            user?: Omit<User, 'password'>
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) throw new Error()

        const token = authHeader.replace('Bearer', '')
        const key = env.get('JWT_SIGNING_KEY').toString('room-api-secret')
        const { user } = jwt.verify(token, key) as jwt.JwtPayload

        const store = new AccountStore()
        const u = await store.get(user)

        if (!u) throw new Error()
        
        req.user = u

        next()
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: 'Unauthorized',
            data: null
        })
    }
}