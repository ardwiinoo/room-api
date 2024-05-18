import { CreateRoom, Room } from "./room.model"
import { Op } from "sequelize"

interface Store {
    save(r: CreateRoom): Promise<Room>
    getAll(searchTerm: string | undefined): Promise<Room[]>
}

export class RoomStore implements Store {
    
    async save(r: CreateRoom): Promise<Room> {
        const room = await Room.create({
            name: r.name
        })

        return room
    }

    async getAll(searchTerm: string | undefined): Promise<Room[]> {
        const queryOptions = searchTerm ? { where: { name: { [Op.like]: `%${searchTerm}%` } } } : {}
        const rooms = await Room.findAll(queryOptions)
        return rooms
    }
}