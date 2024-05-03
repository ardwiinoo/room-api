import { User } from "./account.model";

interface Store {
    get(id: string): Promise<User | undefined>
}

export class AccountStore implements Store {
    
    async get(id: string): Promise<User | undefined> {
        const userId = parseInt(id) 
        const user = await User.findByPk(userId)
        if(!user) return

        return user
    }

}