import { IncomingMessage, Server, ServerResponse } from "http"
import express, { Express } from "express"
import { ExpressService, services } from "../app/module"
import { env } from "../lib/env"
import { Connection, Database } from "../db"
import logger from "morgan"
import cors from "cors"
import { User } from "./module/account/account.model"
import { Room } from "./module/room/room.model"
import { UserRoom } from "./module/user-room/user-room.model"
import { typeable } from "./middleware"

export interface Service {
    createRoutes(): void
}

export interface ServiceInitter {
    init(): void
}

function canInit(service: any): service is ServiceInitter {
    return 'init' in service
}

export interface ServiceCloser {
    close(): void
}

function canClose(service: any): service is ServiceCloser {
    return 'close' in service
}

export interface App {
    server: Server<typeof IncomingMessage, typeof ServerResponse>
    services: Service[],
    app: Express

    start(): Promise<void>
    shutdown(): Promise<void>
}

export interface AppOption {
    name?: string
    useDb?: boolean
    services?: ExpressService[]
    port?: number
}

export interface Plugin {
    install(app: App, option: AppOption): void
}

export class RoomApi implements App {
    server: Server<typeof IncomingMessage, typeof ServerResponse>
    services: Service[] = []

    private BASE_URL = env.get('BASE_URL').toString('http://localhost:9000')
    private option: AppOption
    private db: Connection = new Database()
    private environtment= env.get('NODE_ENV').toString('dev')

    private plugins: Plugin[] = []

    constructor(public app: Express, option?: AppOption) {
        this.option = {
            services,
            name: 'RoomApi',
            useDb: true,
            port: 9000,
            ...option
        }

        // set default middleware
        app.disable('x-powered-by')
        app.use(
            express.json(),
            express.urlencoded({ extended: true }),
            typeable,
            logger(':method \t :url \t :status \t :response-time ms'),
            cors({ 
                origin: env.get('CORS_ALLOWED_ORIGIN').toString('*'),
                credentials: true,
                allowedHeaders: ["Accept", 'X-Requested-With', 'X-HTTP-Method-Override', "Content-Type", "Content-Length", "Accept-Encoding", "Authorization"]
            }),
        )

        this.server = this.app.listen(this.option.port, () => {
            const BASE_URL = this.changePort(this.option.port!)
            console.log(`Server ${this.option.name} is running at ${BASE_URL}`)
        })
    }

    changePort(port: number): string {
        let baseUrl = this.BASE_URL
        const splitted = this.BASE_URL.split(':')
        
        if (splitted.length > 2) {
            splitted[2] = String(port)
            baseUrl = splitted.join(':')
        }

        return baseUrl
    }

    use(plugin: Plugin): App {
        this.plugins.push(plugin)
        return this
    }

    installPlugin() {
        for (const plugin of this.plugins) {
            plugin.install(this, this.option)
        }
    }

    async initializeModels() {
        const db = Database.getSQLInstance();
        User.initialize(db)
        Room.initialize(db)
        UserRoom.initialize(db)
    }

    async start(): Promise<void> {
        if (this.option.useDb) await this.db.open()
        this.initializeModels()
        this.installPlugin()

        for (const service of this.option.services!) {
            const svc = service(this.app)

            if (canInit(svc)) svc.init()
            svc.createRoutes()

            this.services.push(svc)
        }
    }

    private async _shutdown() {
        console.log('\nHTTP server closed...')
        if (this.server) this.server.close()
        if (this.option.useDb) await this.db.close()
    }

    async shutdown(): Promise<void> {
         for (const service of this.services) {
            if (canClose(service)) service.close()
        }

        if (this.environtment === 'test') await this._shutdown()

        // graceful shutdown
        const signals = ['SIGTERM', 'SIGINT', 'SIGQUIT']
        for (const signal of signals) {
            process.on(signal, () => this._shutdown())
        }
    }    
}