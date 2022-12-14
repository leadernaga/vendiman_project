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
const user_services_1 = __importDefault(require("../../services/user_services/user_services"));
const status_codes_1 = __importDefault(require("../../utils/Errors/status_codes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function verify_otp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        req.logger.info('user in user_controllers verify');
        try {
            const jwt = yield user_services_1.default.login_otp_verify(req);
            req.logger.info('user_services login_otp_verify success and sending response to user');
            res.status(200).send({ message: 'success', token: jwt });
        }
        catch (err) {
            req.logger.info('user_services verify_otp got error');
            next(err);
        }
    });
}
function send_otp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        req.logger.info('user in send otp controller');
        try {
            yield user_services_1.default.send_otp_service(req);
            req.logger.info('user services successfull sending response 200 to user');
            res.status(status_codes_1.default.ok).send({
                message: 'successfully message sended',
            });
        }
        catch (err) {
            req.logger.error('user control got an error');
            next(err);
        }
    });
}
exports.default = { verify_otp, send_otp };
