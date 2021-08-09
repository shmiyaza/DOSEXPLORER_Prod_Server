import express from 'express'

import { user } from '../interfaces/objects/user'
import { mongodb } from '../libs/mongodb'
import { client } from '../app'
import { FilterQuery } from 'mongodb'
import { createUserObject } from '../libs/verifyData'

const router = express.Router()
const mongo = new mongodb<user>(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')


// router.all('*', (req, res, next) => {
//     if (req.isAuthenticated()){
//       next()
//     } else {
//       res.status(404).json({error: {errorCode: 'Unauthorize.', message: 'Authorize bafore call API.'}})
//     }
//   })

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
        res.status(200).json(users)
    })()

})

//Create User
router.post('/', (req, res) => {
    const data = new createUserObject(req.body as user)
    const newlyUser = data.createUser()

    if (!newlyUser)
        return res.status(400).json({ errors: data.errorCnt, message: data.errorMsg });

    (async () => {
        const col = await mongo.getCollection(client)
        const result = await mongo.insertOnetoCol(col, newlyUser)
        if (result.result.ok) {
            return res.status(200).json({ message: 'Successfully create user.', result: result.result })
        }
    })()
})


module.exports = router
