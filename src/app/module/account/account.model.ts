import {Sequelize, DataTypes, Model } from "sequelize";
import Joi from "joi";
import { Validator, validateSchema } from "../../../lib/validator"

export class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;

    static initialize(sequelize: Sequelize) {
        this.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING
        }, {
            sequelize,
            modelName: 'User',
            underscored: true,
            tableName: 'users'
        });
    }
}

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

export type Login = {
    email: string
    password: string
}

export function login(data: any): Validator {
    return {
        validate: () => validateSchema(loginSchema, data)
    }
}

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

export type Register = {
    name: string
    email: string
    password: string
}

export function register(data: any): Validator {
    return {
        validate: () => validateSchema(registerSchema, data)
    }
}

export default {
    login, register
}