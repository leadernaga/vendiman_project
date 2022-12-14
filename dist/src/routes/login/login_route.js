"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("../../controllers/user_controllers/user_controllers"));
const route = (0, express_1.Router)();
// utils.log.info('balle balle')
// console.log(logger.info(""), 'loggere')
route.post('/verify', user_controllers_1.default.verify_otp);
route.post('/sendotp', user_controllers_1.default.send_otp);
exports.default = route;
