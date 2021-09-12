"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const localAuthentication_1 = require("../libs/localAuthentication");
const router = express_1.default.Router();
// Local login with username and userpassword
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authContext = new localAuthentication_1.localAuth();
    const result = yield authContext.localAuth(req.body.username, req.body.password);
    if (!result) {
        res.status(401).json({ message: 'authentication failed.' });
    }
    else {
        req.session.regenerate(() => {
            req.session.user = authContext.authenticatedUser.UserPrincipalName;
            res.status(200).json({ message: 'login success.' });
        });
    }
}));
// Logout (Destroy session)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        err ? console.log(err) :
            res.status(200).json({ message: 'logout.' });
    });
});
// Check is authenticated
router.get('/check', (req, res) => {
    req.session.user ? res.status(200).json({ username: req.session.user })
        : res.status(401);
});
// Retrive Json Web Token
router.get('/token', (req, res, next) => {
    req.session.user ? next() :
        res.status(401).json({ error: { errorCode: 'Unauthorize.', message: 'Authorize bafore call API.' } });
}, (req, res) => {
    const token = jsonwebtoken_1.default.sign({ user: req.session.user }, process.env.SECRET || 'test', { expiresIn: '365 days' });
    res.status(200).json({ token: token });
});
module.exports = router;
