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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("../libs/mongodb");
const app_1 = require("../app");
const router = express_1.default.Router();
const mongo = new mongodb_1.mongodb(process.env.DATABASE || 'DOSEXPLORER', process.env.USER || 'DOSEXPLORER_User');
// router.all('*', (req, res, next) => {
//     if (req.isAuthenticated()){
//       next()
//     } else {
//       res.status(404).json({error: {errorCode: 'Unauthorize.', message: 'Authorize bafore call API.'}})
//     }
//   })
//Get all users
router.get('/', (_req, res) => {
    const options = { projection: { _id: 0, Password: 0 } };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const col = yield mongo.getCollection(app_1.client);
        const docs = yield mongo.findDocFromCol(col, {}, options);
        const users = yield docs.sort({ UserPrincipalName: 1 }).toArray();
        res.status(200).json(users);
    }))();
});
//Get some user with filter query
router.get('/:user', (req, res) => {
    const searchString = req.params.user;
    const filter = {
        $or: [
            { UserPrincipalName: new RegExp(searchString, 'i') },
            { ObjectGUID: new RegExp(searchString, 'i') },
            { Email: new RegExp(searchString, 'i') },
        ]
    };
    const options = { projection: { _id: 0, Password: 0 } };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const col = yield mongo.getCollection(app_1.client);
        const docs = yield mongo.findDocFromCol(col, filter, options);
        const users = yield docs.sort({ UserPrincipalName: 1 }).toArray();
        res.status(200).json(users);
    }))();
});
module.exports = router;
