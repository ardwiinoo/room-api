import { parseFlags } from "./lib/parser"
import dotenv from "dotenv"
import express from "express"
import { env } from './lib/env';
import { RoomApi } from "./app";

const flags = parseFlags(process.argv)
dotenv.config({
    path: flags.env
})

const app = express()
const roomapi = new RoomApi(app, {
    port: flags.port ? Number(flags.port) : env.get('PORT').toNumber(9000)
})

roomapi.start()
roomapi.shutdown()