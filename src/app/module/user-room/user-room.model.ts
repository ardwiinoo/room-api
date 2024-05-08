import { DataTypes, Model } from "sequelize";
import { Room } from "../room/room.model";
import { User } from "../account/account.model";
import { Database } from "../../../db";

const db = Database.getSQLInstance()

export class UserRoom extends Model {}

UserRoom.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: User,
            key: 'id'
        }
    },
    roomId: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Room,
            key: 'id'
        }
    }
}, {
    sequelize: db,
    modelName: 'UserRoom',
    tableName: 'user_rooms'
});
