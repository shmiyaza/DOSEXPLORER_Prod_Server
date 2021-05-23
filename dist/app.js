"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const app = express_1.default();
app.disable('x-powered-by');
app.use(cookie_parser_1.default());
app.use(express_1.default.json({ 'type': ['application/json', 'application/scim+json'] }));
// add passportJs midleware 
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
console.log('test');
// set response header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://brave-moss-0ec70b500.azurestaticapps.net");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Csrftoken");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === 'OPTION') {
        res.send(200);
    }
    else {
        next();
    }
});
app.get('*', (req, res) => {
    res.send(process.env.SESSION_SECRET);
    res.send(process.env.CUSTOMCONNSTR_DATABASE_SECRET);
    console.log(req.headers);
});
app.listen(process.env.port || process.env.PORT || 4001, () => { });
