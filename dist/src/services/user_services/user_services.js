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
const otp_generator_1 = __importDefault(require("otp-generator"));
function login_otp_verify(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, otp } = req.body;
        req.logger.info("user in login_otp_verify service");
        if (!email || !utils_1.default.validateEmail(email) || !otp) {
            req.logger.error("user email or otp is failed");
            const error = new custom_error_1.default(error_message_1.default.invalid_email_otp, status_codes_1.default.bad_request);
            throw error;
        }
        const user_data = yield user_queries_1.default.get_user_by_email(email, req);
        if (!user_data) {
            req.logger.error("user not found in database");
            const error = new custom_error_1.default(error_message_1.default.user_notfound, status_codes_1.default.not_found);
            throw error;
        }
        if (!user_data.token) {
            req.logger.error("user dont have token and he may not went through sendotp");
            const error = new custom_error_1.default(error_message_1.default.no_otp_generated, status_codes_1.default.unauthorized);
            throw error;
        }
        const verify_otp = utils_1.default.verifyJWT(user_data.token);
        if (verify_otp.otp != otp) {
            req.logger.error("user entered wrong otp ");
            const error = new custom_error_1.default(error_message_1.default.invalid_otp, status_codes_1.default.unauthorized);
            throw error;
        }
        const jwt = utils_1.default.generateJWT(email, otp, user_data.role, '1d');
        req.logger.info("jwt token created in verify_service and sending to verify_controllers");
        return jwt;
    });
}
function send_otp_service(req) {
    return __awaiter(this, void 0, void 0, function* () {
        req.logger.info('user in send otp service');
        const { email } = req.body;
        if (!email || !utils_1.default.validateEmail(email)) {
            req.logger.error("user email is not valid");
            const error = new custom_error_1.default(error_message_1.default.invalid_email, status_codes_1.default.bad_request);
            throw error;
        }
        const user_data = yield user_queries_1.default.get_user_by_email(email, req);
        if (!user_data) {
            req.logger.error("user email  not found in database");
            throw new custom_error_1.default(error_message_1.default.user_notfound, status_codes_1.default.not_found);
        }
        const otp = otp_generator_1.default.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
        });
        req.logger.info("otp is generated");
        const token = utils_1.default.generateJWT(user_data.email, otp, user_data.role);
        req.logger.info("jwt token is created");
        yield user_queries_1.default.update_user_token(email, token);
        req.logger.info("sending otp to email");
        const result = yield utils_1.default.sendMail({
            email,
            otp,
            username: user_data.name,
        });
        if (result.message === 'unsuccess') {
            req.logger.error("cant able to send email got error");
            throw new custom_error_1.default(error_message_1.default.email_sending_failed, status_codes_1.default.internal_error);
        }
        return result;
    });
}
exports.default = { login_otp_verify, send_otp_service };
