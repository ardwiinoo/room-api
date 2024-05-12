import { Service } from "../../index"
import express, { Express } from "express"
import { ChatStore } from "./chat.store"

export class ChatService implements Service {
    
    private store = new ChatStore()

    constructor(private app: Express) {}
    
    createRoutes(): void {
        const v1 = express.Router()

        this.app.use('/api/v1', v1)
    }
}