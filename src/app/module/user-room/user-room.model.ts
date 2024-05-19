import { Sequelize, DataTypes, Model } from "sequelize"
import { Room } from "../room/room.model"
import { User } from "../account/account.model"

export class UserRoom extends Model {
    public id!: number;
    public userId!: number;
    public roomId!: number;

    static initialize(sequelize: Sequelize) {
        this.init({
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
            sequelize,
            modelName: 'UserRoom',
            underscored: true,
            tableName: 'user_rooms'
        });
    }
}
