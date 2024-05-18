import Joi from "joi"
import { Sequelize, DataTypes, Model } from "sequelize"
import { Validator, validateSchema } from "../../../lib/validator"

export class Room extends Model {
    public id!: number
    public name!: string
    
    static initialize(sequelize: Sequelize) {
        this.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING
            },{
            sequelize: sequelize,
            modelName: 'Room',
            underscored: true,
            tableName: 'rooms'
        });
    }
}

const createRoomSchema = Joi.object({
    name: Joi.string().required()
})

export type CreateRoom = {
    name: string
}

export function createRoom(data: any): Validator {
    return {
        validate: () => validateSchema(createRoomSchema, data)
    }
}

export default {
    createRoom
}