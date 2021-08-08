import { MongoClient, Collection } from 'mongodb'

import { user } from '../interfaces/objects/user'

export class mongoDb<T> {
    client: Promise<MongoClient>

    constructor(public databaseName: string, public collectionName: string) {
        this.client = MongoClient.connect(process.env.CONNECTION_URI! || 'mongodb://shmiyaza:wpPpNXHG31Hta4noucc9yTLhhm7AP9CNRs23Kd7LbiFmzGqvv48I6jukzdKPK4UjGQBWYjE3k3CDxmK6dix6iw%3D%3D@shmiyaza.mongo.cosmos.azure.com:10255/?ssl=true&appName=@shmiyaza@', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    async connect(client: Promise<MongoClient>) {
        const db = (await (await client).connect()).db(this.databaseName)
        return db.collection<T>(this.collectionName)
    }

    async searchDocFromCol(col: Collection<T>) {
        const docs: T | T[] | null = await col.find({},)
            .sort({ UserPrincipalName: 1 })
            .toArray()
        return docs
    }

    async closeConnection(client: Promise<MongoClient>) {
        (await client).close()
    }
}
