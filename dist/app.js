"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = require("mongodb");
const uuid_1 = require("uuid");
const app = express_1.default();
app.disable('x-powered-by');
app.use(cookie_parser_1.default());
app.use(express_1.default.json({ 'type': ['application/json', 'application/scim+json'] }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_session_1.default({
    genid: (_req) => { return uuid_1.v4(); },
    secret: process.env.SECRET || 'test',
    resave: false,
    saveUninitialized: false,
    name: 'TOKEN',
    proxy: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'none'
    }
}));
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
// connection Azure Cosmos
mongodb_1.MongoClient.connect(process.env.CONNECTION_URI || 'mongodb://shmiyaza:wpPpNXHG31Hta4noucc9yTLhhm7AP9CNRs23Kd7LbiFmzGqvv48I6jukzdKPK4UjGQBWYjE3k3CDxmK6dix6iw%3D%3D@shmiyaza.mongo.cosmos.azure.com:10255/?ssl=true&appName=@shmiyaza@', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err)
        throw err;
    exports.client = database;
    app.listen(process.env.port || process.env.PORT || 4001, () => { });
});
app.use('/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
