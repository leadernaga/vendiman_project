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
const sinon_1 = __importDefault(require("sinon"));
const utils_1 = __importDefault(require("../utils/utils"));
describe('utils', () => {
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('generate jwt should give token ', () => {
        const token = utils_1.default.generateJWT('naga@gmail.com', '12345', 'customer');
        expect(token).toBeDefined();
    });
    it('verify jwt should give false on wrong token ', () => {
        const result = utils_1.default.verifyJWT('wrongtoke');
        expect(result).toBe(false);
    });
    it('verify jwt should give correct response ', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield utils_1.default.verifyJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hZ2FAZ21haWwuY29tIiwib3RwIjoiMTIzNDUiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NzAwNzE0NDZ9.tyrZ-4QOmAX74fC_qsLZzRczKWdkNI0YhxDJOlFHE3M');
        expect(result).toStrictEqual({
            email: 'naga@gmail.com',
            iat: 1670071446,
            otp: '12345',
            role: 'customer',
        });
    }));
    it('validate gmail should give false on invalid mail ', () => {
        const result = utils_1.default.validateEmail('naga@gmailcom');
        expect(result).toBe(false);
    });
    it('validate gmail should give true on correct mail ', () => {
        const result = utils_1.default.validateEmail('naga@gmail.com');
        expect(result).toBe(true);
    });
    // it('send mail should give message success ', async () => {
    //     const result: any = await utils.sendMail({
    //         email: 'pluralsightvendiman@gmail.com',
    //         username: 'naga',
    //         otp: '12345',
    //     })
    //     expect(result.message).toBe('success')
    // })
    // it('send mail should give message unsuccess on invalid mail ', async () => {
    //     // jest.setTimeout(10000)
    //     const result: any = await utils.sendMail({
    //         email: '',
    //         otp: '',
    //         username: '',
    //     })
    //     expect(result.message).toBe('unsuccess')
    // })
});
