"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDb = void 0;
const mongodb_1 = require("mongodb");
class mongoDb {
    constructor(databaseName, collectionName) {
        this.databaseName = databaseName;
        this.collectionName = collectionName;
        console.log(process.env.CONNECTION_URI);
        this.client = mongodb_1.MongoClient.connect(process.env.CONNECTION_URI);
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (yield (yield this.client).connect()).db(this.databaseName);
                const user = db.collection(this.collectionName)
                    .findOne({
                    $and: [
                        { UserPrincipalName: 'shmiyaza@microsoft.com' }
                    ]
                });
                console.log();
                return user;
            }
            finally {
                (yield this.client).close();
            }
        });
    }
}
exports.mongoDb = mongoDb;
