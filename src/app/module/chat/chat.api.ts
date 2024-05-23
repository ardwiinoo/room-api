import { Service } from "../../index"
import express, { Express } from "express"
import { Server, Socket } from "socket.io"
import { ChatEventHandler } from "./chat.event"

export class ChatService implements Service {
    
    private rtc: Server
    private eventHandler: ChatEventHandler

    constructor(private app: Express) {
        this.rtc = this.app.rtc
        this.eventHandler = new ChatEventHandler(this.rtc)
    }

    handlerSocket = (socket: Socket) => {
        socket.on('chat', this.eventHandler.create(socket))
        socket.on('chat-history', this.eventHandler.getHistories(socket))
    }
    
    createRoutes(): void {
        const v1 = express.Router()

        this.app.use('/api/v1', v1)
        this.rtc.on('connection', this.handlerSocket)
    }
}