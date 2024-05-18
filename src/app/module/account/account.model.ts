import {Sequelize, DataTypes, Model } from "sequelize";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
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

const complexityOptions = {
  min: 5,
  max: 12,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
}

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: passwordComplexity(complexityOptions)
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
    password: passwordComplexity(complexityOptions)
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