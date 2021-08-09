import { MongoClient, Collection, FindOneOptions, Cursor, WithoutProjection } from 'mongodb'

export class mongodb<T> {
    constructor(public databaseName: string, public collectionName: string) { }

    async getCollection(client: MongoClient) {
        const db = client.db(this.databaseName)
        return db.collection<T>(this.collectionName)
    }

    async searchDocFromCol(col: Collection<T>, options?: any) {
        const docs: Cursor<T> | Cursor<T[]> | null = await col.find({}, options)
        return docs
    }

    async closeConnection(client: Promise<MongoClient>) {
        (await client).close()
    }
}
