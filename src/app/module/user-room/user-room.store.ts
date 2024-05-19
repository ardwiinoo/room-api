import { UserRoom } from "./user-room.model"

export interface JoinRoom {
    userId: number
    roomId: number
}

interface Store {
    join(r: JoinRoom): Promise<UserRoom>
}

export class UserRoomStore implements Store {
    
    async join(r: JoinRoom): Promise<UserRoom> {
        const room = await UserRoom.create({
            userId: r.userId,
            roomId: r.roomId
        })

        return room
    }
}