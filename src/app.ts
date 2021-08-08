import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import { mongoDb } from './libs/db'
import { user } from './interfaces/objects/user'

const app = express()

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

// app.use('/auth', require('./routes/authRoutes'))
app.get('/', (req, res) => {
    const db = new mongoDb(process.env.DATABASE!, process.env.USER!)
    const user: user = db.main().catch(err => {
        console.log(err)
    }).then(() => {
        res.send(user)
    })
})

app.listen(process.env.port || process.env.PORT || 4001, () => { })
