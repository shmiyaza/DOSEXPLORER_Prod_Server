import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { MongoClient } from 'mongodb'
import { v4 } from 'uuid'

const app = express()
export let client: MongoClient

app.disable('x-powered-by')
app.use(cookieParser())
app.use(express.json({ 'type': ['application/json', 'application/scim+json'] }))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    genid: (_req) => { return v4() },
    secret: process.env.SECRET! || 'test',
    resave: false,
    saveUninitialized: false,
    name: 'TOKEN',
    proxy: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hour
        sameSite: 'none'
    }
}))

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
MongoClient.connect(process.env.CONNECTION_URI! || 'mongodb://shmiyaza:wpPpNXHG31Hta4noucc9yTLhhm7AP9CNRs23Kd7LbiFmzGqvv48I6jukzdKPK4UjGQBWYjE3k3CDxmK6dix6iw%3D%3D@shmiyaza.mongo.cosmos.azure.com:10255/?ssl=true&appName=@shmiyaza@&retryWrites=false', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err) throw err
    client = database
    app.listen(process.env.port || process.env.PORT || 4001, () => { })
})


app.use('/users', require('./routes/userRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/scim/v2', require('./routes/scimRoutes'))
