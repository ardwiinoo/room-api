import { auth } from "../../middleware/auth"
import { Service } from "../../index"
import { UserRoomStore } from "./user-room.store"
import express, { Express, Request, Response } from "express"

export class UserRoomService implements Service {
    
    private store = new UserRoomStore()

    constructor(private app: Express) {}

    joinRoom = async (req: Request, res: Response) => {
        try {
            const roomId = req.getParam("roomId").toNumber()
            const room = await this.store.join({ roomId: roomId, userId: req.user?.id! })

            res.status(201).send({
                code: 201,
                message: "Created",
                data: {
                    roomId: room.id
                }
            })
        } catch (error) {
            res.status(500).send({
                code: 500,
                message: `${error}`,
                data: null
            })
        }
    }
    
    createRoutes(): void {
        const v1 = express.Router()

        v1.post('/rooms/join/:roomId', auth, this.joinRoom)

        this.app.use('/api/v1', v1)
    }
}