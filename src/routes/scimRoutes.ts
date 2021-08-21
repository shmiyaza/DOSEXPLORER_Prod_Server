import express from 'express'
import jwt from 'jsonwebtoken'

import { resourceTypes } from '../libs/scim/schemas/resourceTypes'
import { serviceProviderConfig } from '../libs/scim/schemas/serviceProviderConfig'
import { Schemas } from '../libs/scim/schemas/Schemas'
import { scimErrors } from '../libs/scim/scimCore/scimError'
import { scimUser } from '../interfaces/scim/scimUser'
import { mongodb } from '../libs/mongodb'
import { client } from '../app'
import { FilterQuery, FindOneAndUpdateOption, InsertOneWriteOpResult } from 'mongodb'
import { scimCore } from '../libs/scim/scimCore/scimCore'
import { userSchema } from '../interfaces/scim/userSchema'
import { userManagement } from '../libs/verifyData'
import { patchOp } from '../interfaces/scim/patchOp'

const router = express.Router()
const mongo = new mongodb<scimUser>(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')


// verify jwt token from authrorization header.
// if jwt isn't verified, response status code 401.
router.all('*', (req, res, next) => {
    let token: string = ''

    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }

    jwt.verify(token, process.env.SECRET || 'test', (err) => {
        if (err) {
            const error = scimErrors.scimErrorUnauthrorized()
            res.status(error.status).json(error)
        } else {
            next()
        }
    })
})

// get resourcetypes
router.get('/ResourceTypes', (_req, res) => {
    res.status(200).json(resourceTypes)
})

// get serviceproviderconfig
router.get('/ServiceProviderConfig', (_req, res) => {
    res.status(200).json(serviceProviderConfig)
})

// get schemas
router.get('/Schemas', (_req, res) => {
    res.status(200).json(Schemas)
})

// get user 
router.get('/Users', async (req, res) => {
    let filter: string[]
    let attribute: string
    let val: string
    let scimUser: scimUser[]

    // get a query(e.g. scim/v2/Users?userName eq 'test@contoso.com')
    if (req.query.filter) {
        filter = (req.query.filter as string).split(' ')
        attribute = filter[0].toLocaleLowerCase()
        val = filter[2]

        // remove double or single quotation from the string.
        val = val.replace(/^"(.*)"$/, '$1')
        val = val.replace(/^'(.*)'$/, '$1')

        // Azure AD uses only attribute 'userName' with filter query.
        // https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#get-user-by-query
        if (attribute === 'username') {
            const filter: FilterQuery<any> = { UserPrincipalName: new RegExp(`^${val}$`, 'i') };
            const options: any = { projection: { _id: 0, Password: 0 } };

            const col = await mongo.getCollection(client)
            scimUser = await (await mongo.findDocFromCol(col, filter, options)).toArray()
            res.status(200).json(scimCore.listResponse(scimUser))
        } else {
            const error = scimErrors.scimErrorNotImplemented()
            res.status(error.status).json(error)
        }
        // when filter query is not exsist, get all scimuser.
    } else {
        const options: any = { projection: { _id: 0, Password: 0 } };

        const col = await mongo.getCollection(client)
        scimUser = await (await mongo.findDocFromCol(col, {}, options)).toArray()
        res.status(200).json(scimCore.listResponse(scimUser))
    }
})

// get a target user
router.get('/Users/:userId', async (req, res) => {
    const searchString = req.params.userId
    const filter: FilterQuery<any> = { ObjectGUID: new RegExp(searchString) }
    const options: any = { projection: { _id: 0, Password: 0 } }

    const col = await mongo.getCollection(client)
    const scimUser = await (await mongo.findDocFromCol(col, filter, options)).toArray()

    // If target path is exist, response a scimuser as knownResrouce
    // If target path is not undefined, response scimError 404 "NotFound" - RFC7644 3.12.
    scimUser.length ? res.status(200).json(scimCore.knownResource(scimUser[0]))
        : res.status(404).json(scimErrors.scimErrorNotFound(searchString))
})

// delete user
router.delete('/Users/:userId', async (req, res) => {
    const searchString = req.params.userId
    const filter: FilterQuery<any> = { ObjectGUID: new RegExp(searchString) }

    const col = await mongo.getCollection(client)
    const result = await mongo.deleteDocFromCol(col, filter)

    result.ok ? res.status(204).send()
        : res.status(404).json(scimErrors.scimErrorNotFound(searchString))
})

// create a user
router.post('/Users', (req, res) => {
    const body: userSchema = (req.body as userSchema)
    const scimUser = scimCore.convertAttributeToScimuser(body)
    const data = new userManagement(scimUser)
    const newlyUser = data.createUser()

    if (!newlyUser)
        return res.status(409).json({ errors: data.errorCnt, message: data.errorMsg });

    (async () => {
        const col = await mongo.getCollection(client)
        mongo.insertOnetoCol(col, newlyUser)
            .then(() => {
                return res.status(201).json(scimCore.knownResource(newlyUser))
            })
            .catch(err => {
                if (err.code === 2)
                    return res.status(500).json('The specified options are in error or are incompatible with other options.')
                if (err.code === 11000)
                    return res.status(409).json(scimErrors.scimErrorConfilctTarget())
            })
    })()
})

router.patch('/Users/:userId', async (req, res) => {
    const searchString = req.params.userId
    const filter: FilterQuery<any> = { ObjectGUID: new RegExp(searchString) }
    const options: FindOneAndUpdateOption<scimUser> = {
        returnDocument: 'after',
        projection: { _id: 0, Password: 0 },
    }

    const col = await mongo.getCollection(client)
    const targetUser = await (await mongo.findDocFromCol(col, filter)).toArray()

    // If target path is not undefined, response scimError 404 "NotFound" - RFC7644 3.12.
    if (!targetUser.length)
        return res.status(404).json(scimErrors.scimErrorNotFound(searchString))

    const scimUser = scimCore.parsePatchOp((req.body) as patchOp)
    const data = new userManagement(scimUser)
    const updatedUser = data.updateUser()

    if (!updatedUser)
        return res.status(400).json({ errors: data.errorCnt, message: data.errorMsg })

    const result = await mongo.updateDocFromCol(col, filter, scimUser, options)
    res.status(200).json(scimCore.knownResource(result.value!) as scimUser)
})

module.exports = router