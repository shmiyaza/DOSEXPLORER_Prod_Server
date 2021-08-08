import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { MongoClient } from 'mongodb'

import { mongoDb } from './libs/mongodb'
import { user } from './interfaces/objects/user'

const app = express()
let client: MongoClient

app.disable('x-powered-by')
app.use(cookieParser())
app.use(express.json({ 'type': ['application/json', 'application/scim+json'] }))

// set response header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Csrftoken")
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')

    if (req.method === 'OPTION') {
        res.send(200)
    } else {
        next()
    }
})

// connection Azure Cosmos
MongoClient.connect(process.env.CONNECTION_URI! || 'mongodb://shmiyaza:wpPpNXHG31Hta4noucc9yTLhhm7AP9CNRs23Kd7LbiFmzGqvv48I6jukzdKPK4UjGQBWYjE3k3CDxmK6dix6iw%3D%3D@shmiyaza.mongo.cosmos.azure.com:10255/?ssl=true&appName=@shmiyaza@', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err) throw err
    client = database
    app.listen(process.env.port || process.env.PORT || 4001, () => { })
})

// app.use('/auth', require('./routes/authRoutes'))
app.get('/', (req, res) => {
    const mongo = new mongoDb(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')
    mongo.getCollection(client)
        .then(col => {
            mongo.searchDocFromCol(col)
                .then(docs => {
                    res.json(docs)
                })
        })
})


