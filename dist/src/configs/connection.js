"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment = 'development';
const config = require('../../knexfile')[environment];
const knex = require('knex')(config);
exports.default = knex;
