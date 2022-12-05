"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const utils_1 = __importDefault(require("./utils/utils"));
const login_route_1 = __importDefault(require("./routes/login/login_route"));
require('dotenv').config();
const app = (0, express_1.default)();
exports.default = app;
//middleweres
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.status(200).send({ message: "welcome to vendiman" });
});
app.use('/login', login_route_1.default);
app.use((req, res) => {
    res.status(404).send({ message: 'route not found' });
});
app.listen(process.env.PORT, () => {
    utils_1.default.log.info(`server running on  port ${process.env.PORT}`);
});
