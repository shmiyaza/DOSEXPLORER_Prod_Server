import { MongoClient, Collection } from 'mongodb'

export class mongoDb<T> {
    constructor(public databaseName: string, public collectionName: string) { }

    async getCollection(client: MongoClient) {
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
