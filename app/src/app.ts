import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'

const app = express()

app.disable('x-powered-by')
app.use(cookieParser())
app.use(express.json({ 'type': ['application/json', 'application/scim+json'] }))

// add passportJs midleware 
app.use(passport.initialize())
app.use(passport.session())

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

app.get('/', (req, res) => {
    res.send(`${process.env.SESSION_SECRET}, ${process.env.CUSTOMCONNSTR_CUSTOMCONNSTR_DATABASE_SECRET}, test`)
})

app.listen(process.env.port || process.env.PORT || 4001, () => { })
