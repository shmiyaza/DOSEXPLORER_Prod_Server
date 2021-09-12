import express from 'express'

import { user } from '../interfaces/objects/user'
import { mongodb } from '../libs/mongodb'
import { client } from '../app'
import { FilterQuery, FindOneAndUpdateOption } from 'mongodb'
import { userManagement } from '../libs/userManagement'

const router = express.Router()
const mongo = new mongodb<user>(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')

router.all('*', (req, res, next) => {
    (req.session as any).user ? next() :
        res.status(400).json({ error: { errorCode: 'Unauthorize.', message: 'Authorize bafore call API.' } })
})

//Get all users
router.get('/', (_req, res) => {
    const options: any = { projection: { _id: 0, Password: 0 } };

    (async () => {
        const col = await mongo.getCollection(client)
        const docs = await mongo.findDocFromCol(col, {}, options)
        const users = await docs.sort({ UserPrincipalName: 1 }).toArray()
        res.status(200).json(users)
    })()
})

//Get some user with filter query
router.get('/:user', (req, res) => {
    const searchString = req.params.user
    const filter: FilterQuery<any> = {
        $or: [
            { UserPrincipalName: new RegExp(searchString, 'i') },
            { ObjectGUID: new RegExp(searchString, 'i') },
            { Email: new RegExp(searchString, 'i') },
        ]
    }

    const options: any = { projection: { _id: 0, Password: 0 } };

    (async () => {
        const col = await mongo.getCollection(client)
        const docs = await mongo.findDocFromCol(col, filter, options)
        const users = await docs.sort({ UserPrincipalName: 1 }).toArray()

        if (!users)
            res.status(200).json(`${searchString} is not found.`)
        res.status(200).json(users)
    })()

})

//Create a user
router.post('/', (req, res) => {
    const data = new userManagement(req.body as user)
    const newlyUser = data.createUser()

    if (!newlyUser)
        return res.status(400).json({ errors: data.errorCnt, message: data.errorMsg });

    (async () => {
        const col = await mongo.getCollection(client)
        const result = await mongo.insertOnetoCol(col, newlyUser)
        if (result.result.ok) {
            return res.status(200).json({ message: 'Successfully create a user.', result: result.result })
        }
    })()
})

// Delete a user
router.delete('/:user', (req, res) => {
    const searchString = req.params.user
    const filter: FilterQuery<any> = {
        $or: [
            { UserPrincipalName: new RegExp(searchString, 'i') },
            { ObjectGUID: new RegExp(searchString, 'i') },
            { Email: new RegExp(searchString, 'i') },
        ]
    };

    (async () => {
        const col = await mongo.getCollection(client)
        const result = await mongo.deleteDocFromCol(col, filter)

        if (!result.ok)
            res.status(400).json({ message: result.lastErrorObject })
        res.status(200).json({ message: 'Successfully delete a user.', result: result.ok })
    })()

})

// Update a user
router.patch('/:user', (req, res) => {
    const searchString = req.params.user
    const update = (req.body as user)
    const data = new userManagement(update)
    const options: FindOneAndUpdateOption<user> = { returnDocument: 'after' }
    const filter: FilterQuery<any> = {
        $or: [
            { UserPrincipalName: new RegExp(searchString, 'i') },
            { ObjectGUID: new RegExp(searchString, 'i') },
            { Email: new RegExp(searchString, 'i') },
        ]
    }

    const updatedUser = data.updateUser()
    if (!updatedUser)
        return res.status(400).json({ errors: data.errorCnt, message: data.errorMsg });

    (async () => {
        const col = await mongo.getCollection(client)
        const result = await mongo.updateDocFromCol(col, filter, updatedUser, options)

        if (!result.ok)
            res.status(400).json({ message: result.lastErrorObject })
        res.status(200).json({ message: 'Successfully update a user.', result: result.ok })
    })()



})

module.exports = router
