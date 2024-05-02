import { Database } from "@/db";
import { DataTypes, Model } from "sequelize";

const db = Database.getSQLInstance()

class User extends Model {
    id!: number;
    name!: string;
    email!: string;
    password!: string;
}

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