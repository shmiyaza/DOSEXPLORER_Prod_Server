"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./libs/db");
const app = express_1.default();
app.disable('x-powered-by');
app.use(cookie_parser_1.default());
app.use(express_1.default.json({ 'type': ['application/json', 'application/scim+json'] }));
// set response header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Csrftoken");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    if (req.method === 'OPTION') {
        res.send(200);
    }
    else {
        next();
    }
});
app.use('/auth', require('./routes/authRoutes'));
app.get('/', (req, res) => {
    const db = new db_1.mongoDb(process.env.DATABASE, process.env.USER);
    const user = db.main();
    res.send(user);
});
app.listen(process.env.port || process.env.PORT || 4001, () => { });
