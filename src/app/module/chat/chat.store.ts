import { Chat } from './chat.model'
import { Document } from 'mongoose'

export interface CreateChat {
    roomId: string
    userId: string
    message: string
}

interface Store {
    save(c: CreateChat): Promise<Document>
    getHistories(roomId: string): Promise<Document[]>
}

export class ChatStore implements Store {
    
    async save(c: CreateChat): Promise<Document> {
        const chat = new Chat({
            roomId: c.roomId,
            userId: c.userId,
            message: c.message
        })

        await chat.save()
        return chat
    }

     async getHistories(roomId: string): Promise<Document[]> {
        return Chat.find({ roomId }).exec()
    }
}