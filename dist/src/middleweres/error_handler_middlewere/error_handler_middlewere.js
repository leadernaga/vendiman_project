"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const status_codes_1 = __importDefault(require("../../utils/Errors/status_codes"));
const error_message_1 = __importDefault(require("../../utils/Errors/error_message"));
function error_handler_middlewere(error, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let message;
        if (error.message === 'Error') {
            message = error_message_1.default.internal_error;
        }
        else {
            message = error.message;
        }
        if (error) {
            return res
                .status(error.status || status_codes_1.default.internal_error)
                .send({ message });
        }
        next();
    });
}
exports.default = error_handler_middlewere;
