"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
require("dotenv/config");
const port = process.env.NODE_ENV == 'test'
    ? process.env.TEST_PORT || 3000
    : process.env.DEV_PORT || 8080;
// console.log(process.env.DB_URL, "Server ");
index_1.default.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
