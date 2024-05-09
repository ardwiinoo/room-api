import { Login, User } from "./account.model";
import bcrypt from "bcrypt"

export interface CreateUser {
    name: string
    email: string
    password?: string
}

interface Store {
    get(id: string): Promise<User | undefined>
    create(user: CreateUser): Promise<User>
    login(user: Login): Promise<User | undefined>
}

export class AccountStore implements Store {
    
    private salt = 10

    async get(id: string): Promise<User | undefined> {
        const userId = parseInt(id) 
        const user = await User.findByPk(userId)
        if(!user) return

        return user
    }

    async create(user: CreateUser): Promise<User> {
        let password: string | undefined
        if (user.password) password = await bcrypt.hash(user.password, this.salt)
        
        const u = await User.create({
            name: user.name,
            email: user.email,
            password: password,
        })

        return u
    }

    async login(user: Login): Promise<User | undefined> {
        const u = await User.findOne({
            where: { email: user.email }
        })

        if (!u) return

        const same = await bcrypt.compare(user.password, u.password)
        if (same) return u
    }
}