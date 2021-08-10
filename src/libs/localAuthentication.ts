import { FilterQuery } from "mongodb";
import { user } from "../interfaces/objects/user";
import { bcryptOperation } from "./bcryptOperation";
import { mongodb } from '../libs/mongodb'
import { client } from "../app";

const mongo = new mongodb<user>(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')

export class auth {
    authenticatedUser: user

    constructor() {
        this.authenticatedUser = {}
    }

    // Local login with username and password
    async localAuth(username: string, password: string) {
        const filter: FilterQuery<any> = { UserPrincipalName: new RegExp(username, 'i') }
        const options: any = { projection: { _id: 0 } }

        const col = await mongo.getCollection(client)
        const doc = await mongo.findDocFromCol(col, filter, options)
        this.authenticatedUser = (await doc.toArray())[0]

        return this.authenticatedUser && await bcryptOperation.compareHashString(password, this.authenticatedUser.Password!) ?
            true : false
    }
}