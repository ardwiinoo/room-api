import { Sequelize } from "sequelize"
import mongoose from "mongoose"
import { env } from "../lib/env"

export interface Connection {
    open(): Promise<void>
    close(): Promise<void>
}

export class Database implements Connection {

    private static sqlInstance: Sequelize     
    private static mdbInstance: typeof mongoose
    
    private sqlConfig = {
        database: env.get('DB_NAME').toString(),
        username: env.get('DB_USER').toString(''),
        password: env.get('DB_PASS').toString(),
        host: env.get('DB_HOST').toString(),
        port: env.get('DB_PORT').toNumber()
    }
    private static mdbUri = env.get('MONGO_URI').toString()
    
    public static getSQLInstance(): Sequelize {
        return Database.sqlInstance
    }

    public static async getMDBInstance(): Promise<typeof mongoose> {
        return Database.mdbInstance
    }

    async open(): Promise<void> {
        if (Database.sqlInstance) return

        Database.sqlInstance = new Sequelize(this.sqlConfig.database, this.sqlConfig.username, this.sqlConfig.password, {
            host: this.sqlConfig.host,
            dialect: 'mysql',
            port: this.sqlConfig.port
        })

        await Database.sqlInstance.authenticate()

        // if (Database.mdbInstance) return

        // await mongoose.connect(Database.mdbUri)
        // Database.mdbInstance = mongoose
    }

    async close(): Promise<void> {
        // if (Database.mdbInstance) await Database.mdbInstance.disconnect()
        if (Database.sqlInstance) await Database.sqlInstance.close()
    }
}
