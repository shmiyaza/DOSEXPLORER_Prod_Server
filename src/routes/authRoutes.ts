import express from 'express'
import jwt from 'jsonwebtoken'

import { auth } from '../libs/localAuthentication'

const router = express.Router()

// Local login with username and userpassword
router.post('/login', async (req, res) => {
    const authContext = new auth()
    const result = await authContext.localAuth(req.body.username, req.body.password)

    if (!result) {
        res.status(401).json({ message: 'authentication failed.' })
    } else {
        req.session.regenerate(() => {
            (req.session as any).user = authContext.authenticatedUser.UserPrincipalName
            res.status(200).json({ message: 'login success.' })
        })
    }
})

// Logout (Destroy session)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        err ? console.log(err) :
            res.status(200).json({ message: 'logout.' })
    })
})

// Check is authenticated
router.get('check', (req, res) => {
    (req.session as any).user ? res.status(200).json({ username: (req.session as any).user })
        : res.status(401)
})

// Retrive Json Web Token
router.get('/token', (req, res, next) => {
    (req.session as any).user ? next() :
        res.status(401).json({ error: { errorCode: 'Unauthorize.', message: 'Authorize bafore call API.' } });

}, (req, res) => {
    const token = jwt.sign({ user: (req.session as any).user }, (process.env.SECRET as string) || 'test', { expiresIn: '365 days' })
    res.status(200).json({ token: token })
})

module.exports = router

