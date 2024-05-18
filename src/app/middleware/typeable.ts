import { Parser, parse } from "../../lib/parser"
import { Request, Response, NextFunction } from "express"

declare global {
    namespace Express {
        interface Request {
            getQuery: (key: string) => Parser
            getParam: (key: string) => Parser
        }
    }
}

export async function typeable(req: Request, res: Response, next: NextFunction) {
    req.getQuery = (key: string): Parser => {
        return parse(req.query[key] as string)
    }

    req.getParam = (key: string): Parser => {
        return parse(req.params[key])
    }

    next()
}