import { Service } from "../index";
import { Express } from "express";
import { AccountService } from "./account/account.api";
import { RoomService } from "./room/room.api";

export type ExpressService = (app: Express) => Service
export const services: ExpressService[] = [
    app => new AccountService(app),
    app => new RoomService(app)
]