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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../index"));
const inventory_queries_1 = __importDefault(require("../../queries/inventory_queries/inventory_queries"));
const utils_1 = __importDefault(require("../../utils/utils"));
const inventory_items_queries_1 = __importDefault(require("../../queries/inventory_items_queries/inventory_items_queries"));
describe('inventory', () => {
    describe('/ post items', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('should get response 401 on not providing token', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns(false);
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({});
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('please provide valid token');
        }));
        it('should get response 401 on jwt failed', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns(false);
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({ inventory_id: 'expample' })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('user authentication failed please login again');
        }));
        it('should get response 401 on user not Admin', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ role: 'customer' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({ inventory_id: 'expample' })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('unauthorization cant access this route');
        }));
        it('should get response 400 on not providing inventory_id', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ role: 'admin' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({ inventory: 'expample' })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"inventory_id" is required');
        }));
        it('should get response 500 on jwt throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').throwsException();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({ inventory_id: 'expample' })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong');
        }));
        it('should get response 200 on correct details', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ role: 'admin' });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'post_items_on_inventory')
                .resolves({ message: 'success' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({
                inventory_id: 'expample',
                item_ids: [{ item_id: '123', qty: 10 }],
            })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('success');
        }));
        it('should get response 500 on post fail', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ role: 'admin' });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'post_items_on_inventory')
                .rejects();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({
                inventory_id: 'expample',
                item_ids: [{ item_id: '123', qty: 10 }],
            })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong internally');
        }));
        it('should get response 500 on database fail error', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ role: 'admin' });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'post_items_on_inventory')
                .resolves(new Error('h'));
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({
                inventory_id: 'expample',
                item_ids: [{ item_id: '123', qty: 10 }],
            })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong internally');
        }));
        it('should get response 400 on providing ivalid details to database', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ role: 'admin' });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'post_items_on_inventory')
                .resolves({ code: '22P02' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({
                inventory_id: 'expample',
                item_ids: [{ item_id: '123', qty: 10 }],
            })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('please provide valid details');
        }));
        it('should get response 500 on post fail', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').returns({ role: 'admin' });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'post_items_on_inventory')
                .rejects();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items')
                .send({
                inventory_id: 'expample',
                item_ids: [{ item_id: '123', qty: 10 }],
            })
                .set('Authorization', 'bearer 1234');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong internally');
        }));
    });
    describe('get /inventory/list', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('should give response 200 on query success', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(inventory_queries_1.default, 'getInventoryList')
                .resolves({ data: [''], message: 'success' });
            const response = yield (0, supertest_1.default)(index_1.default).get('/inventory/list');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('success');
        }));
        it('should give response 500 on query fail', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(inventory_queries_1.default, 'getInventoryList').rejects();
            const response = yield (0, supertest_1.default)(index_1.default).get('/inventory/list');
            // expect(response.status).toBe(500)
            expect(response.body.message).toBe('something went wrong internally');
        }));
    });
});
