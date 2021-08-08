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
class mongoDb {
    constructor(databaseName, collectionName) {
        this.databaseName = databaseName;
        this.collectionName = collectionName;
    }
    getCollection(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = (yield (yield client).connect()).db(this.databaseName);
            return db.collection(this.collectionName);
        });
    }
    searchDocFromCol(col) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield col.find({})
                .sort({ UserPrincipalName: 1 })
                .toArray();
            return docs;
        });
    }
    closeConnection(client) {
        return __awaiter(this, void 0, void 0, function* () {
            (yield client).close();
        });
    }
}
exports.mongoDb = mongoDb;
