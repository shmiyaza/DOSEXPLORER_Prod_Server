import { MongoClient, Collection, Cursor, FindOneOptions, FilterQuery } from 'mongodb'

export class mongodb<T> {
    constructor(public databaseName: string, public collectionName: string) { }

    // Get collection
    async getCollection(client: MongoClient) {
        return client.db(this.databaseName)
            .collection<T>(this.collectionName)
    }

    // Close MongoClient
    async closeConnection(client: Promise<MongoClient>) {
        (await client).close()
    }

    // Get docs with find method
    async findDocFromCol(col: Collection<T>, filter: FilterQuery<any> = {}, options?: any) {
        const docs: Cursor<T> | Cursor<T[]> | null = await col.find(filter, options)
        return docs
    }
}
