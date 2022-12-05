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
function get_user(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield connection_1.default
                .select('*')
                .where('email', email)
                .from('users')
                .first();
            if (!user.email) {
                return { message: 'not found' };
            }
            return Object.assign(Object.assign({}, user), { message: 'success' });
        }
        catch (err) {
            return { message: 'unsuccess' };
        }
    });
}
function update_user_token(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, connection_1.default)('users')
                .update({ token: token })
                .where('email', email);
            return Object.assign(Object.assign({}, user), { message: 'success' });
        }
        catch (err) {
            return { message: 'unsuccess' };
        }
    });
}
exports.default = { get_user, update_user_token };
