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
exports.localAuth = void 0;
const bcryptOperation_1 = require("./bcryptOperation");
const mongodb_1 = require("../libs/mongodb");
const app_1 = require("../app");
const mongo = new mongodb_1.mongodb(process.env.DATABASE || 'DOSEXPLORER', process.env.USER || 'DOSEXPLORER_User');
class localAuth {
    constructor() {
        this.authenticatedUser = {};
    }
    // Local login with username and password
    localAuth(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { UserPrincipalName: new RegExp(username, 'i') };
            const options = { projection: { _id: 0 } };
            const col = yield mongo.getCollection(app_1.client);
            const doc = yield mongo.findDocFromCol(col, filter, options);
            this.authenticatedUser = (yield doc.toArray())[0];
            return this.authenticatedUser && (yield bcryptOperation_1.bcryptOperation.compareHashString(password, this.authenticatedUser.Password)) ?
                true : false;
        });
    }
}
exports.localAuth = localAuth;
