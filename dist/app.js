"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = require("mongodb");
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
// app.use('/auth', require('./routes/authRoutes'))
// app.get('/', (req, res) => {
//     const mongo = new mongoDb(process.env.DATABASE! || 'DOSEXPLORER', process.env.USER! || 'DOSEXPLORER_User')
//     mongo.getCollection(client)
//         .then(col => {
//             mongo.searchDocFromCol(col)
//                 .then(docs => {
//                     res.json(docs)
//                 })
//         })
// })
app.use('/users', require('./routes/userRoutes'));
