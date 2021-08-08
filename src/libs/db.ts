import { MongoClient } from 'mongodb'

import { user } from '../interfaces/objects/user'

export class mongoDb {
    client: Promise<MongoClient>

    constructor(public databaseName: string, public collectionName: string) {
        console.log(process.env.CONNECTION_URI!)
        this.client = MongoClient.connect(process.env.CONNECTION_URI!)
    }

    async main() {
        try {
            const db = (await (await this.client).connect()).db(this.databaseName)
            const user: user = db.collection(this.collectionName)
                .findOne({
                    $and: [
                        { UserPrincipalName: 'shmiyaza@microsoft.com' }
                    ]
                })
            console.log()
            return user
        } finally {
            (await this.client).close()
        }
    }

}
