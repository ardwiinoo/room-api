import { Database } from "@/db";
import { DataTypes, Model } from "sequelize";

const db = Database.getSQLInstance()

export class Room extends Model {}

Room.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING
}, {
    sequelize: db,
    modelName: 'Room',
    tableName: 'rooms'
})