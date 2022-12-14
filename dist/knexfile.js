"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Update with your config settings.
const path_1 = __importDefault(require("path"));
const BASE_PATH = path_1.default.join(__dirname, 'src', 'configs');
const config = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'nagaapparaopolqamarasetti',
            password: '12345',
            database: 'vendiman',
        },
        migrations: {
            directory: path_1.default.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path_1.default.join(BASE_PATH, 'seeds'),
        },
    },
    test: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'nagaapparaopolqamarasetti',
            password: '12345',
            database: 'vendiman',
        },
        migrations: {
            directory: path_1.default.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path_1.default.join(BASE_PATH, 'seeds'),
        },
    },
};
module.exports = config;
