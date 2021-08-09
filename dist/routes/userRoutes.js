"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("../libs/mongodb");
const app_1 = require("../app");
const router = express_1.default.Router();
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
    const mongo = new mongodb_1.mongodb(process.env.DATABASE || 'DOSEXPLORER', process.env.USER || 'DOSEXPLORER_User');
    mongo.getCollection(app_1.client)
        .then(col => {
        mongo.searchDocFromCol(col, options)
            .then(docs => {
            const users = docs.sort({ UserPrincipalName: 1 }).toArray();
            users.then(val => {
                res.status(200).json(val);
            });
        });
    });
});
module.exports = router;
