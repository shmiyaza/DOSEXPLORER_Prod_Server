import express from 'express'
import { v4 } from 'uuid'
import { xml2js } from 'xml-js'
import { samlAuth } from '../libs/samlAuthentication'

const router = express.Router()
const samlContext = new samlAuth(
    {
        ForceAuthn: process.env.saml_forceAuthn || 'false',
        isPassive: process.env.saml_isPassive || 'false',
        AssertionConsumerServiceURL: process.env.saml_ASC || 'http://localhost:4001/saml/callback',
        Issuer: process.env.saml_Issuer || 'http://localhost:4001/saml/',
        NameIdPolicy: process.env.saml_NameIdPolicy || 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
        RequestedAuthnContext: process.env.saml_RequestedAuthnContext || 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',
        Cert: process.env.saml_Cert || 'MIIC8DCCAdigAwIBAgIQeKky39Mmi71K6vAURjUioDANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yMTA4MjIwOTEwMzlaFw0yNDA4MjIwOTEwMzlaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1bmc+dEuLrvEo9zbHpPl8VudubUjrzIWDRj1x6eEs8sKP5omc/DrCMx5ak4ABHMJG7lxllnpyO5mKVj0FcRFuZCp9UuekEqHZGxq0ORaAAqJUlSwzQ2nvcvIUXWRSnDjqj5E+fMJmfzJHLeBGWRWDz/27x7MGMU1ya8P0wyYKQhtdIDfYCafEZBF7itQ9ntXtGe7Hyiqm60UJ0qkfCFhWGoIfmhjBaYxmTOfzach25f6PpSlSv1jZRyMjMfLuiV5uYY4krO8XZ8fsNw/VqVjFvE+MWFeh6aFRjayABEn7IEvjSELSY2949lCvX4pxSrmom9J8p2XkVMTZDoTV5N0XQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCcnwgH7AlYMPIY6TY9fMyUw44nWHz+NnHzgohKIWIUGnTumHaBrlhh0jj0Zoovrd/j1S1RVlNha1vBfgKVWCPB8khZ3AlE+uDT+J/hYlU9YttuzGEFUOuhcYDQT45Osbrx9i5QRBWMAAumzkbyVKr6inc0jV0PaVYCh8E8SDsYKtN8GDKGq49kKtmGWrUOEVt45IswT5GrquOc5ehKWAQo1aqc2BkjVTFwxxV1AcMz0GhazXwbxFbv+SkN+5bXYkcWP76Gfsfj0gJFsY/+EDKU6HePGnp1K57/gwy2PUTxElmNpPaiclikvFzQ7dK37amTCvGyEF9JuyloWR3qTjwJ'
    }
)

router.get('/login', (req, res) => {
    samlContext.samlElements.IssueInstant = new Date().toISOString()
    samlContext.samlElements.Id = `_${v4()}`

    const samlReq = samlContext.authnRequest()
    const url = new URL(process.env.saml_url || 'https://login.microsoftonline.com/98233760-1031-441c-94b2-fb2d6ac9d019/saml2')

    url.searchParams.append('SAMLRequest', samlReq.samlRequest)
    if (samlReq.RelayState) url.searchParams.append('RelayState', samlReq.RelayState)

    res.redirect(url.href)
})

router.post('/callback', async (req, res) => {
    const samlResponse = req.body.SAMLResponse
    const relayState = req.body.RelayState ? req.body.RelayState : undefined

    const result = await samlContext.samlAuth(samlResponse)

    if (!result) {
        res.status(401).json({ message: 'authentication failed.' })
    } else {
        req.session.regenerate(() => {
            (req.session as any).user = samlContext.authenticatedUser.UserPrincipalName
            res.status(200).json({ message: 'login success.' })
        })
    }
})

module.exports = router