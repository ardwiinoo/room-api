import { Server, Socket } from "socket.io"
import { ChatStore, CreateChat } from "./chat.store"

export class ChatEventHandler {

    private store = new ChatStore()

    constructor(private rtc: Server) {}

    create = (socket: Socket) => async (data: CreateChat) => {
        try {
            const chat = await this.store.save(data)
            this.rtc.to(data.roomId).emit(
                'chat', chat
            )
        } catch (error) {
            socket.emit(
                'error', `${error}`
            )
        }
    }

    getHistories = (socket: Socket) => async (roomId: string) => {
        try {
            const chatHistory = await this.store.getHistories(roomId)
            socket.emit(
                'chat-history', chatHistory
            )
        } catch (error) {
            socket.emit(
                'error', `${error}`
            )
        }
    }
}