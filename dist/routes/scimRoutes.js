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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const resourceTypes_1 = require("../libs/scim/schemas/resourceTypes");
const serviceProviderConfig_1 = require("../libs/scim/schemas/serviceProviderConfig");
const Schemas_1 = require("../libs/scim/schemas/Schemas");
const scimError_1 = require("../libs/scim/scimCore/scimError");
const mongodb_1 = require("../libs/mongodb");
const app_1 = require("../app");
const scimCore_1 = require("../libs/scim/scimCore/scimCore");
const verifyData_1 = require("../libs/verifyData");
const router = express_1.default.Router();
const mongo = new mongodb_1.mongodb(process.env.DATABASE || 'DOSEXPLORER', process.env.USER || 'DOSEXPLORER_User');
// verify jwt token from authrorization header.
// if jwt isn't verified, response status code 401.
router.all('*', (req, res, next) => {
    let token = '';
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
    jsonwebtoken_1.default.verify(token, process.env.SECRET || 'test', (err) => {
        if (err) {
            const error = scimError_1.scimErrors.scimErrorUnauthrorized();
            res.status(error.status).json(error);
        }
        else {
            next();
        }
    });
});
// get resourcetypes
router.get('/ResourceTypes', (_req, res) => {
    res.status(200).json(resourceTypes_1.resourceTypes);
});
// get serviceproviderconfig
router.get('/ServiceProviderConfig', (_req, res) => {
    res.status(200).json(serviceProviderConfig_1.serviceProviderConfig);
});
// get schemas
router.get('/Schemas', (_req, res) => {
    res.status(200).json(Schemas_1.Schemas);
});
// get user 
router.get('/Users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filter;
    let attribute;
    let val;
    let scimUser;
    // get a query(e.g. scim/v2/Users?userName eq 'test@contoso.com')
    if (req.query.filter) {
        filter = req.query.filter.split(' ');
        attribute = filter[0].toLocaleLowerCase();
        val = filter[2];
        // remove double or single quotation from the string.
        val = val.replace(/^"(.*)"$/, '$1');
        val = val.replace(/^'(.*)'$/, '$1');
        // Azure AD uses only attribute 'userName' with filter query.
        // https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#get-user-by-query
        if (attribute === 'username') {
            const filter = { UserPrincipalName: new RegExp(`^${val}$`, 'i') };
            const options = { projection: { _id: 0, Password: 0 } };
            const col = yield mongo.getCollection(app_1.client);
            scimUser = yield (yield mongo.findDocFromCol(col, filter, options)).toArray();
            res.status(200).json(scimCore_1.scimCore.listResponse(scimUser));
        }
        else {
            const error = scimError_1.scimErrors.scimErrorNotImplemented();
            res.status(error.status).json(error);
        }
        // when filter query is not exsist, get all scimuser.
    }
    else {
        const options = { projection: { _id: 0, Password: 0 } };
        const col = yield mongo.getCollection(app_1.client);
        scimUser = yield (yield mongo.findDocFromCol(col, {}, options)).toArray();
        res.status(200).json(scimCore_1.scimCore.listResponse(scimUser));
    }
}));
// get a target user
router.get('/Users/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchString = req.params.userId;
    const filter = { ObjectGUID: new RegExp(searchString) };
    const options = { projection: { _id: 0, Password: 0 } };
    const col = yield mongo.getCollection(app_1.client);
    const scimUser = yield (yield mongo.findDocFromCol(col, filter, options)).toArray();
    // If target path is exist, response a scimuser as knownResrouce
    // If target path is not undefined, response scimError 404 "NotFound" - RFC7644 3.12.
    scimUser.length ? res.status(200).json(scimCore_1.scimCore.knownResource(scimUser[0]))
        : res.status(404).json(scimError_1.scimErrors.scimErrorNotFound(searchString));
}));
// delete user
router.delete('/Users/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchString = req.params.userId;
    const filter = { ObjectGUID: new RegExp(searchString) };
    const col = yield mongo.getCollection(app_1.client);
    const result = yield mongo.deleteDocFromCol(col, filter);
    result.ok ? res.status(204).send()
        : res.status(404).json(scimError_1.scimErrors.scimErrorNotFound(searchString));
}));
// create a user
router.post('/Users', (req, res) => {
    const body = req.body;
    const scimUser = scimCore_1.scimCore.mappingAttributeFromScimUser(body);
    const data = new verifyData_1.userManagement(scimUser);
    const newlyUser = data.createUser();
    if (!newlyUser)
        return res.status(400).json({ errors: data.errorCnt, message: data.errorMsg });
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const col = yield mongo.getCollection(app_1.client);
        const result = yield mongo.insertOnetoCol(col, newlyUser);
        if (result.result.ok) {
            return res.status(201).json(scimCore_1.scimCore.knownResource(newlyUser));
        }
    }))();
});
module.exports = router;
