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
// import inventory_queries from '../../queries/item_queries/inventory_queries'
const user_queries_1 = __importDefault(require("../../queries/user_queries.ts/user_queries"));
const utils_1 = __importDefault(require("../../utils/utils"));
const inventory_items_queries_1 = __importDefault(require("../../queries/inventory_items_queries/inventory_items_queries"));
describe('inventory', () => {
    describe('/items/filter', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('should need to give an error on inventory id not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/filter?category=bevareges')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('please provide valid inventory_id');
        }));
        it('should need to give an error on empty query', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/filter')
                .set('inventory_id', '12345');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('please filter on field name or category or price');
        }));
        it('should able to get response 400 on wrong query', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(inventory_items_queries_1.default, 'filter_items').resolves({});
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/filter?name=man')
                .set('inventory_id', '12345');
            // console.log(response.body)
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('no result found on filter');
        }));
        it('should able to get error 500 on database fail', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'filter_items')
                .throwsException();
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/filter?name=man')
                .set('inventory_id', '12345');
            // console.log(response.body)
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong internally');
        }));
        it('should able to search on name field', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'filter_items')
                .resolves({ name: 'mango' });
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/filter?name=man')
                .set('inventory_id', '12345');
            expect(response.body.data.name).toBe('mango');
            expect(response.body.message).toBe('success');
        }));
    });
    describe('/items/search', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('should get response 400 on empty inventory id', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default).get('/inventory/search');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('please provide valid inventory_id');
        }));
        it('should get response 404 on no result found', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(inventory_items_queries_1.default, 'search_items').resolves([]);
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/search?q=namaste')
                .set('inventory_id', '12345');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('no result found on search query');
        }));
        it('should get response 200 on valid database result', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'search_items')
                .resolves([{ name: 'naga' }]);
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/search?q=namaste')
                .set('inventory_id', '12345');
            expect(response.status).toBe(200);
            expect(response.body.data).toMatchObject([{ name: 'naga' }]);
        }));
        it('should get response 500 on  database fail', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'search_items')
                .throwsException();
            const response = yield (0, supertest_1.default)(index_1.default)
                .get('/inventory/search?q=namaste')
                .set('inventory_id', '12345');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong internally');
        }));
    });
    describe('items/place_order', () => {
        afterEach(() => {
            sinon_1.default.restore();
        });
        it('should give respons 401 on not provideing jwt token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .send({
                inventory_id: '1234',
                item_ids: [{ item_id: '1234', qty: 5 }],
            });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('please provide valid token');
        }));
        it('should give respons 401 on not providing jwt token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .send({
                inventory_id: '1234',
                item_ids: [{ item_id: '1234', qty: 5 }],
            })
                .set('authorization', 'bearer wrongtoken');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('user authorization failed please login again');
        }));
        it('should give respons 500 on jwt throw Exception', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').throwsException();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '12345' });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong');
        }));
        it('should give respons 400 on invalid details item_ids:string', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: '123' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"item_ids" must be an array');
        }));
        it('should give respons 400 on invalid details item_id:string ', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: [''] });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"item_ids[0]" must be of type object');
        }));
        it('should give respons 400 on invalid details on not prividing item:id in object ', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: [{ item_i: '122' }] });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"item_ids[0].item_id" is required');
        }));
        it('should give respons 400 on invalid details  on not providing quantity ', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({ inventory_id: '1234', item_ids: [{ item_id: '122' }] });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"item_ids[0].qty" is required');
        }));
        it('should give respons 400 on wrong data type of item_id ', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                inventory_id: '1234',
                item_ids: [{ item_id: 12 }],
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('"item_ids[0].item_id" must be a string');
        }));
        it('should give respons 400 on wrong data type of qty ', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                inventory_id: '1234',
                item_ids: [{ item_id: '12', qty: 'h' }],
            });
            //   expect(response.status).toBe(400)
            expect(response.body.message).toBe('"item_ids[0].qty" must be a number');
        }));
        it('should give respons 406 on less quantity', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            sinon_1.default.stub(user_queries_1.default, 'get_user_by_email').resolves();
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'get_inventory_items_data')
                .resolves([
                { item_id: '123', price: 10, qty: 0, item_name: 'mango' },
            ]);
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                inventory_id: '123',
                item_ids: [{ item_id: '123', qty: 10 }],
            });
            expect(response.status).toBe(406);
            expect(response.body.message).toBe('mango dont have enough quantity');
        }));
        it('should give respons 402 on less user balance', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            sinon_1.default
                .stub(user_queries_1.default, 'get_user_by_email')
                .resolves({ email: 'email', name: 'naga', balance: 10 });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'get_inventory_items_data')
                .resolves([
                { item_id: '123', price: 10, qty: 20, item_name: 'mango' },
            ]);
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                inventory_id: '123',
                item_ids: [{ item_id: '123', qty: 10 }],
            });
            expect(response.status).toBe(402);
            expect(response.body.message).toBe('user dont have enough balance');
        }));
        it('should give respons 200 on successful place order', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            sinon_1.default
                .stub(user_queries_1.default, 'get_user_by_email')
                .resolves({ email: 'email', name: 'naga', balance: 1000 });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'get_inventory_items_data')
                .resolves([
                { item_id: '123', price: 10, qty: 20, item_name: 'mango' },
            ]);
            sinon_1.default.stub(user_queries_1.default, 'update_user_token').resolves();
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'post_ordered_items')
                .resolves({ message: 'success' });
            sinon_1.default
                .stub(inventory_items_queries_1.default, 'update_inventory_items_qty')
                .resolves();
            sinon_1.default.stub(user_queries_1.default, 'update_user_balance').resolves();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                inventory_id: '123',
                item_ids: [{ item_id: '123', qty: 10 }],
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('success');
        }));
        it('should give respons 500 on database error', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(utils_1.default, 'verifyJWT').resolves();
            sinon_1.default.stub(user_queries_1.default, 'get_user_by_email').throwsException();
            const response = yield (0, supertest_1.default)(index_1.default)
                .post('/inventory/items/place_order')
                .set('authorization', 'bearer wrongtoken')
                .send({
                inventory_id: '1234',
                item_ids: [{ item_id: 'hello', qty: 1 }],
            });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('something went wrong internally');
        }));
    });
});
