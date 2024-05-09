import { Sequelize, DataTypes, Model } from "sequelize";

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
