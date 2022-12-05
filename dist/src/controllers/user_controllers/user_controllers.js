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
const user_queries_1 = __importDefault(require("../../queries/user_queries.ts/user_queries"));
const otpGenerator = require('otp-generator');
const utils_1 = __importDefault(require("../../utils/utils"));
require('dotenv').config();
function login_user(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, otp } = req.body;
        utils_1.default.log.info('user in login route');
        try {
            if (!email || !otp) {
                return res.status(400).send({
                    message: 'please enter valid email and otp',
                });
            }
            const user_data = yield user_queries_1.default.get_user(email);
            if (user_data.message == 'not found') {
                return res.status(404).send({ message: 'user not found' });
            }
            if (user_data.message == 'unsuccess') {
                return res.status(400).send({ message: 'email is not valid' });
            }
            if (!user_data.token) {
                return res
                    .status(401)
                    .send({ message: 'please enter click on get otp' });
            }
            const verify_otp = utils_1.default.verifyJWT(user_data.token);
            if (verify_otp.otp != otp) {
                return res.status(401).send({ message: 'please enter correct otp' });
            }
            const jwt = utils_1.default.generateJWT(email, otp, user_data.role);
            res.status(200).send({ message: 'success', token: jwt });
        }
        catch (err) {
            res.status(500).send({
                message: 'something happened internally please try again',
            });
        }
    });
}
function get_otp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        try {
            if (!email || !utils_1.default.validateEmail(email)) {
                return res
                    .status(400)
                    .send({ message: 'please enter a valid email address' });
            }
            const user_data = yield user_queries_1.default.get_user(email);
            if (user_data.message === 'not found') {
                return res.status(404).send({ message: 'user not found' });
            }
            if (user_data.message == 'unsuccess') {
                return res
                    .status(400)
                    .send({ message: 'please enter a valid email id' });
            }
            const otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
            });
            const token = utils_1.default.generateJWT(user_data.email, otp, user_data.role);
            let update_result = yield user_queries_1.default.update_user_token(email, token);
            if (update_result.message == 'unsuccess') {
                return res
                    .status(500)
                    .send({ message: 'something happened internally' });
            }
            const result = yield utils_1.default.sendMail({
                email,
                otp,
                username: user_data.name,
            });
            if (result.message === 'unsuccess') {
                return res.status(500).send({
                    message: 'cant able to sendmail',
                });
            }
            res.status(200).send({ message: 'successfully message sended' });
        }
        catch (err) {
            res.status(500).send({ message: 'something happened internally' });
        }
    });
}
exports.default = { login_user, get_otp };
