import express from 'express'
import { FindOneOptions } from 'mongodb'

import { user } from '../interfaces/objects/user'
import { mongodb } from '../libs/mongodb'
import { client } from '../app'

const router = express.Router()

// router.all('*', (req, res, next) => {
//     if (req.isAuthenticated()){
//       next()
//     } else {
//       res.status(404).json({error: {errorCode: 'Unauthorize.', message: 'Authorize bafore call API.'}})
//     }
//   })

router.get('/', (_req, res) => {
    const options: any = { projection: { _id: 0, Password: 0 } }
    const mongo = new mongodb<user>(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')

    mongo.getCollection(client)
        .then(col => {
            mongo.searchDocFromCol(col, options)
                .then(docs => {
                    res.status(200).json(docs.sort({ UserPrincipalName: 1 }).toArray())
                })
        })
})