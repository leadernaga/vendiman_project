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
const utils_1 = __importDefault(require("../../utils/utils"));
const user_queries_1 = __importDefault(require("../../queries/user_queries.ts/user_queries"));
const custom_error_1 = __importDefault(require("../../utils/Errors/custom_error"));
const error_message_1 = __importDefault(require("../../utils/Errors/error_message"));
const status_codes_1 = __importDefault(require("../../utils/Errors/status_codes"));
function login_otp_verify(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, otp } = req.body;
        if (!email || !utils_1.default.validateEmail(email) || !otp) {
            const error = new custom_error_1.default(error_message_1.default.invalid_email_otp, status_codes_1.default.bad_request);
            throw error;
        }
        const user_data = yield user_queries_1.default.get_user_by_email(email);
        if (!user_data) {
            const error = new custom_error_1.default(error_message_1.default.user_notfound, status_codes_1.default.not_found);
            throw error;
        }
        if (!user_data.token) {
            const error = new custom_error_1.default(error_message_1.default.no_otp_generated, status_codes_1.default.unauthorized);
            throw error;
        }
        const verify_otp = utils_1.default.verifyJWT(user_data.token);
        if (verify_otp.otp != otp) {
            const error = new custom_error_1.default(error_message_1.default.invalid_otp, status_codes_1.default.unauthorized);
            throw error;
        }
        const jwt = utils_1.default.generateJWT(email, otp, user_data.role, '1d');
        return jwt;
    });
}
exports.default = { login_otp_verify };
