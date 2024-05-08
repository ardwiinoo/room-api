import { Service } from "../index";
import { Express } from "express";
import { AccountService } from "./account/account.api";

export type ExpressService = (app: Express) => Service
export const services: ExpressService[] = [
    app => new AccountService(app)
]