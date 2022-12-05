"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Update with your config settings.
const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'configs');
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
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
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
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
    },
};
module.exports = config;
