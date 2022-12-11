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
function auth_middlewere(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        try {
            if (!token) {
                return res
                    .status(401)
                    .send({ message: 'please provide valid token' });
            }
            const decoded_data = utils_1.default.verifyJWT(token);
            if (!decoded_data) {
                return res.status(401).send({
                    message: 'user authorization failed please login again',
                });
            }
            next();
        }
        catch (err) {
            return res.status(500).send({ message: 'something went wrong' });
        }
    });
}
function admin_middlewere(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        try {
            if (!token) {
                return res
                    .status(401)
                    .send({ message: 'please provide valid token' });
            }
            const decoded_data = utils_1.default.verifyJWT(token);
            if (!decoded_data) {
                return res.status(401).send({
                    message: 'user authentication failed please login again',
                });
            }
            if (decoded_data.role != 'admin') {
                return res
                    .status(401)
                    .send({ message: 'unauthorization cant access this route' });
            }
            next();
        }
        catch (err) {
            return res.status(500).send({ message: 'something went wrong' });
        }
    });
}
exports.default = { auth_middlewere, admin_middlewere };
