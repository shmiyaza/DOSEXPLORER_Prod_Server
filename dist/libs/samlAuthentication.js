"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.samlAuth = void 0;
const zlibt2_1 = require("zlibt2");
const buffer_1 = require("buffer");
const xpath = __importStar(require("xpath"));
const xmldom_1 = require("xmldom");
const xmlCrypto = __importStar(require("xml-crypto"));
const mongodb_1 = require("../libs/mongodb");
const app_1 = require("../app");
const mongo = new mongodb_1.mongodb(process.env.DATABASE || 'DOSEXPLORER', process.env.USER || 'DOSEXPLORER_User');
class samlAuth {
    constructor(samlElements) {
        this.samlElements = samlElements;
        this.authenticatedUser = {};
        this.NameId = '';
    }
    authnRequest() {
        const AuthN = this._generateAuthnRequest(this.samlElements);
        const encodedAuthN = this._encodeAuthnSamlRequest(AuthN);
        return {
            samlRequest: encodedAuthN,
            RelayState: process.env.saml_RelayState || undefined,
        };
    }
    samlAuth(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const xml = this._decodeXml2String(data);
            const doc = new xmldom_1.DOMParser().parseFromString(xml, 'documentElement');
            const cert = this.samlElements.Cert;
            const signature = this._getSignatureFromXml(doc).toString();
            this.NameId = this._getNameIdFromXml(doc)[0].toString();
            console.log(this.NameId);
            if (!this._validateSignatureForSamlResponse(signature, this._certToPEM(cert), xml, doc))
                return false;
            const filter = { UserPrincipalName: new RegExp(this.NameId, 'i') };
            const options = { projection: { _id: 0 } };
            const col = yield mongo.getCollection(app_1.client);
            const document = yield mongo.findDocFromCol(col, filter, options);
            this.authenticatedUser = (yield document.toArray())[0];
            console.log(this.authenticatedUser);
            return this.authenticatedUser ? true : false;
        });
    }
    _encodeAuthnSamlRequest(input) {
        const arrayBuffer = new TextEncoder().encode(input);
        const Deflected = new zlibt2_1.RawDeflate(arrayBuffer).compress();
        return buffer_1.Buffer.from(Deflected).toString('base64');
    }
    _decodeXml2String(input) {
        return buffer_1.Buffer.from(input, 'base64').toString('utf8');
    }
    _generateAuthnRequest(params) {
        return '<?xml version="1.0"?>'
            + `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="${params.Id}" Version="2.0" IssueInstant="${params.IssueInstant}" ForceAuthn="${params.ForceAuthn}" IsPassive="${params.isPassive}" AssertionConsumerServiceURL="${params.AssertionConsumerServiceURL}">`
            + `<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${params.Issuer}</saml:Issuer>`
            + `<samlp:NameIDPolicy xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Format="${params.NameIdPolicy}"/>`
            + `<samlp:RequestedAuthnContext xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Comparison="exact"><saml:AuthnContextClassRef xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">${params.RequestedAuthnContext}</saml:AuthnContextClassRef></samlp:RequestedAuthnContext>`
            + '</samlp:AuthnRequest>';
    }
    _certToPEM(cert) {
        var _a;
        (_a = cert.match(/.{1,64}/g)) === null || _a === void 0 ? void 0 : _a.join('\n');
        if (cert.indexOf('-BEGIN CERTIFICATE-') === -1)
            cert = '-----BEGIN CERTIFICATE-----\n' + cert;
        if (cert.indexOf("-END CERTIFICATE-") === -1)
            cert = cert + "\n-----END CERTIFICATE-----\n";
        return cert;
    }
    _validateSignatureForSamlResponse(signature, certPem, fullxml, currentNode) {
        const sig = new xmlCrypto.SignedXml();
        sig.keyInfoProvider = {
            file: "",
            getKeyInfo: () => "<X509Data></X509Data>",
            getKey: () => buffer_1.Buffer.from(certPem),
        };
        sig.loadSignature(signature);
        return sig.checkSignature(fullxml);
    }
    _getSignatureFromXml(xml) {
        return this._selectXpathNode(xml, 'Signature', 'http://www.w3.org/2000/09/xmldsig#');
    }
    _getNameIdFromXml(xml) {
        return this._selectXpathAndGetText(xml, 'urn:oasis:names:tc:SAML:2.0:assertion', ['Subject', 'NameID']);
    }
    _selectXpathNode(doc, node, nameSpace = '#') {
        return xmlCrypto.xpath(doc, `//*[local-name(.)='${node}' and namespace-uri(.)='${nameSpace}']`);
    }
    _selectXpathAndGetText(doc, node, path) {
        let fullpath = '/';
        const select = xpath.useNamespaces({
            'a': node
        });
        path.forEach(val => {
            fullpath += `/a:${val}`;
        });
        return select(`${fullpath}/text()`, doc);
    }
}
exports.samlAuth = samlAuth;
