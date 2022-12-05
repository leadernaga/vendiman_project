"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controllers_1 = __importDefault(require("../../controllers/inventory_controllers/inventory_controllers"));
const route = (0, express_1.Router)();
route.get('/', inventory_controllers_1.default.getlist);
