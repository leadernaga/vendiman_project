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
const connection_1 = __importDefault(require("../../configs/connection"));
function get_user_by_email(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield connection_1.default.select('*').where('email', email).from('users').first();
    });
}
function update_user_token(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, connection_1.default)('users').update({ token: token }).where('email', email);
    });
}
function update_user_balance(email, balance) {
    return __awaiter(this, void 0, void 0, function* () {
        return connection_1.default
            .select('*')
            .from('users')
            .where('email', email)
            .decrement('balance', balance);
    });
}
exports.default = { get_user_by_email, update_user_token, update_user_balance };
