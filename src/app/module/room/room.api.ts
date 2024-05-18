import { Service } from "../../index"
import express, { Express, Request, Response } from "express"
import { RoomStore } from "./room.store"
import Validator, { CreateRoom } from "./room.model"
import { validate } from "../../middleware/validator"

export class RoomService implements Service {

    private store = new RoomStore()

    constructor(private app: Express) {}

    create = async (req: Request, res: Response) => {
        try {
            const payload = req.body as CreateRoom
            const room = await this.store.save(payload)

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

    getAll = async (req: Request, res: Response) => {
        try {
            const searchTerm = req.getQuery("search").toString()
            const rooms = await this.store.getAll(searchTerm)

            res.status(200).send({
                code: 200,
                message: "Ok",
                data: rooms
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

        v1.post('/rooms', validate(Validator.createRoom), this.create)
        v1.get('/rooms', this.getAll)

        this.app.use('/api/v1', v1)
    }
}