"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const login_route_1 = __importDefault(require("./routes/login/login_route"));
const inventory_route_1 = __importDefault(require("./routes/inventory/inventory.route"));
const items_route_1 = __importDefault(require("./routes/items/items_route"));
require("dotenv/config");
const error_handler_middlewere_1 = __importDefault(require("./middleweres/error_handler_middlewere/error_handler_middlewere"));
const bunyan_1 = __importDefault(require("bunyan"));
const uuid_1 = require("uuid");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_documentation_json_1 = __importDefault(require("./Docs/swagger_documentation.json"));
const app = (0, express_1.default)();
// //middleweres
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).send('please provide json type only');
        }
    }
    next();
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_documentation_json_1.default));
//setting logger on req
app.use((req, res, next) => {
    const logger = bunyan_1.default.createLogger({
        name: 'vendiman',
        request_id: (0, uuid_1.v4)(),
    });
    req.logger = logger;
    next();
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.status(200).send({ message: 'welcome to vendiman' });
});
app.use('/login', login_route_1.default);
app.use('/inventory', inventory_route_1.default);
app.use('/items', items_route_1.default);
app.use(error_handler_middlewere_1.default);
app.use((req, res) => {
    res.status(404).send({ message: 'route not found' });
});
exports.default = app;
