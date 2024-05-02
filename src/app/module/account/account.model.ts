import { Database } from "@/db";
import { DataTypes, Model } from "sequelize";

const db = Database.getSQLInstance()

export class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'users'
})