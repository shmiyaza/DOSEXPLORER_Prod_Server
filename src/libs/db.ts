import { MongoClient, Collection } from 'mongodb'

import { user } from '../interfaces/objects/user'

export class mongoDb<T> {
    client: Promise<MongoClient>

    constructor(public databaseName: string, public collectionName: string) {
        this.client = MongoClient.connect(process.env.CONNECTION_URI!)
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
