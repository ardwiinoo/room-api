import { Service } from "@/app";
import { Express } from "express";

export class AccountService implements Service {

    constructor(private app: Express) {}
    
    createRoutes(): void {
        throw new Error("Method not implemented.");
    }
}