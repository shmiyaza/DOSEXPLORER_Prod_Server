import { RawDeflate, RawInflate } from 'zlibt2'
import { Buffer } from 'buffer'
import * as xpath from 'xpath'
import { DOMParser } from 'xmldom'
import * as xmlCrypto from 'xml-crypto'

import { mongodb } from '../libs/mongodb'
import { user } from '../interfaces/objects/user'
import { authnParams, samlRequest } from '../interfaces/samlParams'
import { FilterQuery } from 'mongodb'
import { client } from '../app'


const mongo = new mongodb<user>(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')

export class samlAuth {
    authenticatedUser: user
    NameId: string

    constructor(public samlElements: authnParams) {
        this.authenticatedUser = {}
        this.NameId = ''
    }

    authnRequest() {
        const AuthN = this._generateAuthnRequest(this.samlElements)
        const encodedAuthN = this._encodeAuthnSamlRequest(AuthN)

        return {
            samlRequest: encodedAuthN,
            RelayState: process.env.saml_RelayState || undefined,
        } as samlRequest
    }

    async samlAuth(data: string) {
        const xml = this._decodeXml2String(data)
        const doc = new DOMParser().parseFromString(xml, 'documentElement')
        const cert = this.samlElements.Cert

        const signature = this._getSignatureFromXml(doc).toString()
        this.NameId = this._getNameIdFromXml(doc)[0].toString()
        console.log(this.NameId)

        if (!this._validateSignatureForSamlResponse(signature, this._certToPEM(cert), xml, doc))
            return false

        const filter: FilterQuery<any> = { UserPrincipalName: new RegExp(this.NameId, 'i') }
        const options: any = { projection: { _id: 0 } }

        const col = await mongo.getCollection(client)
        const document = await mongo.findDocFromCol(col, filter, options)
        this.authenticatedUser = (await document.toArray())[0]
        console.log(this.authenticatedUser)

        return this.authenticatedUser ? true : false
    }

    private _encodeAuthnSamlRequest(input: string) {
        const arrayBuffer = new TextEncoder().encode(input)
        const Deflected = new RawDeflate(arrayBuffer).compress()
        return Buffer.from(Deflected).toString('base64')
    }

    private _decodeXml2String(input: string) {
        return Buffer.from(input, 'base64').toString('utf8')
    }

    private _generateAuthnRequest(params: authnParams) {
        return '<?xml version="1.0"?>'
            + `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="${params.Id}" Version="2.0" IssueInstant="${params.IssueInstant}" ForceAuthn="${params.ForceAuthn}" IsPassive="${params.isPassive}" AssertionConsumerServiceURL="${params.AssertionConsumerServiceURL}">`
            + `<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${params.Issuer}</saml:Issuer>`
            + `<samlp:NameIDPolicy xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Format="${params.NameIdPolicy}"/>`
            + `<samlp:RequestedAuthnContext xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Comparison="exact"><saml:AuthnContextClassRef xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${params.RequestedAuthnContext}</saml:AuthnContextClassRef></samlp:RequestedAuthnContext>`
            + '</samlp:AuthnRequest>'
    }

    private _certToPEM(cert: string): string {
        cert.match(/.{1,64}/g)?.join('\n')
        if (cert.indexOf('-BEGIN CERTIFICATE-') === -1)
            cert = '-----BEGIN CERTIFICATE-----\n' + cert
        if (cert.indexOf("-END CERTIFICATE-") === -1)
            cert = cert + "\n-----END CERTIFICATE-----\n"
        return cert
    }


    private _validateSignatureForSamlResponse(signature: string, certPem: string, fullxml: string, currentNode: Document) {
        const sig = new xmlCrypto.SignedXml()
        sig.keyInfoProvider = {
            file: "",
            getKeyInfo: () => "<X509Data></X509Data>",
            getKey: () => Buffer.from(certPem),
        }
        sig.loadSignature(signature)
        return sig.checkSignature(fullxml)
    }

    private _getSignatureFromXml(xml: Document) {
        return this._selectXpathNode(xml, 'Signature', 'http://www.w3.org/2000/09/xmldsig#')
    }

    private _getNameIdFromXml(xml: Document) {
        return this._selectXpathAndGetText(xml, 'urn:oasis:names:tc:SAML:2.0:assertion', ['Subject', 'NameID'])
    }

    private _selectXpathNode(doc: Document, node: string, nameSpace: string = '#') {
        return xmlCrypto.xpath(doc, `//*[local-name(.)='${node}' and namespace-uri(.)='${nameSpace}']`)
    }

    private _selectXpathAndGetText(doc: Document, node: string, path: string[]) {
        let fullpath = '/'
        const select = xpath.useNamespaces({
            'a': node
        })

        path.forEach(val => {
            fullpath += `/a:${val}`
        })

        return select(`${fullpath}/text()`, doc)
    }

}
