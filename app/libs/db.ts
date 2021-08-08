import { connect, MongoClient } from 'mongodb'

import { user } from '../interfaces/objects/user'

const client = MongoClient.connect(process.env.CONNECTION_URI!)

export class mongoDb {

    constructor(public databaseName: string, public collectionName: string) {
    }

    async main() {
        try {
            const db = (await (await client).connect()).db(this.databaseName)
            const user: user = db.collection(this.collectionName)
                .findOne({
                    $and: [
                        { UserPrincipalName: 'shmiyaza@microsoft.com' }
                    ]
                })

            return user
        } finally {
            (await client).close()
        }
    }

}
