import { MongoClient, Collection, Cursor, FindOneOptions, FilterQuery, OptionalId } from 'mongodb'

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

    // Create a doc with insertOne method
    async insertOnetoCol(col: Collection<T>, doc: OptionalId<T>) {
        return await col.insertOne(doc)
    }

    // Delete a doc with
    async deleteDocFromCol(col: Collection<T>, filter: any) {
        return await col.findOneAndDelete(filter)
    }
}
