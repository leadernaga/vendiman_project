"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("../../controllers/user_controllers/user_controllers"));
const route = (0, express_1.Router)();
route.get('/verify', user_controllers_1.default.login_user);
route.get("/getotp", user_controllers_1.default.get_otp);
exports.default = route;
