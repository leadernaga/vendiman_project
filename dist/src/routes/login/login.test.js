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
const supertest_1 = __importDefault(require("supertest"));
const sinon_1 = __importDefault(require("sinon"));
const index_1 = __importDefault(require("../../index"));
const user_queries_1 = __importDefault(require("../../queries/user_queries.ts/user_queries"));
const utils_1 = __importDefault(require("../../utils/utils"));
describe('/login', () => {
    describe('/getotp', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('get otp should fail on invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            let response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmailcom' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('please enter a valid email address');
        }));
        it('get otp should fail on user not found', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(user_queries_1.default, 'get_user').resolves({
                message: 'not found',
            });
            let response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('user not found');
        }));
        it('get otp should fail on unsuccess while get_user', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(user_queries_1.default, 'get_user').resolves({
                message: 'unsuccess',
            });
            let response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('please enter a valid email id');
        }));
        it('get otp should fail on unsuccess while update_user', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(user_queries_1.default, 'get_user').resolves({
                name: 'naga',
                email: 'pnaga234@gmail.com',
                token: null,
                role: 'admin',
            });
            sinon_1.default.stub(user_queries_1.default, 'update_user_token').resolves({
                message: 'unsuccess',
            });
            let response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something happened internally');
        }));
        it('get otp should fail on failing to send mail', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(user_queries_1.default, 'get_user').resolves({
                name: 'naga',
                email: 'pnaga234@gmail.com',
                token: null,
                role: 'admin',
            });
            sinon_1.default.stub(utils_1.default, 'sendMail').resolves({ message: 'unsuccess' });
            let response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('cant able to sendmail');
        }));
        it('get otp should send success message', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(user_queries_1.default, 'get_user').resolves({
                name: 'naga',
                email: 'pnaga234@gmail.com',
                token: null,
                role: 'admin',
            });
            sinon_1.default.stub(utils_1.default, 'sendMail').resolves({ message: 'success' });
            let response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('successfully message sended');
        }));
        it('get otp should fail on rejects', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(user_queries_1.default, 'get_user').rejects();
            let response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/getotp')
                .send({ email: 'pnaga234@gmail.com' });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something happened internally');
        }));
    });
    describe('/verify', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('on invalid email and otp it should give error', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('please enter valid email and otp');
        }));
        it('on user not found should get a response 404', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(user_queries_1.default, 'get_user')
                .resolves({ message: 'not found' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('user not found');
        }));
        it('on get user query unsuccess message should get 400 response', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(user_queries_1.default, 'get_user')
                .resolves({ message: 'unsuccess' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('email is not valid');
        }));
        it('on token null should give 401 response', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(user_queries_1.default, 'get_user').resolves({ token: null });
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('please enter click on get otp');
        }));
        it('on jwt token verify fail should give 401 response', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(user_queries_1.default, 'get_user')
                .resolves({ message: 'success', token: 'hello babai' });
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves(false);
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('please enter correct otp');
        }));
        it('on jwt token verify fail should give response', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(user_queries_1.default, 'get_user')
                .resolves({ message: 'success', token: 'hello babai' });
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves(false);
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('please enter correct otp');
        }));
        it('on correct details should give response 200', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(user_queries_1.default, 'get_user')
                .resolves({ message: 'success', token: 'hello babai' });
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ otp: '112344' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('success');
        }));
        it('on db fail should give 500 response', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(user_queries_1.default, 'get_user')
                .rejects({ message: 'success', token: 'hello babai' });
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ otp: '112344' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/login/verify')
                .send({ email: 'pnaga234@gmail.com', otp: '112344' });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something happened internally please try again');
        }));
    });
});
