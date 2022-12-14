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
const custom_error_1 = __importDefault(require("../../utils/Errors/custom_error"));
const schema_validations_1 = __importDefault(require("../../utils/validations/schema_validations"));
const status_codes_1 = __importDefault(require("../../utils/Errors/status_codes"));
const inventory_items_queries_1 = __importDefault(require("../../queries/inventory_items_queries/inventory_items_queries"));
const error_message_1 = __importDefault(require("../../utils/Errors/error_message"));
const uuid_1 = require("uuid");
const utils_1 = __importDefault(require("../../utils/utils"));
const user_queries_1 = __importDefault(require("../../queries/user_queries.ts/user_queries"));
function post_inventory_items_service(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const { inventory_id, item_ids } = req.body;
        // input req.body validating through joi validate function
        req.logger.info('user entered into post_inventory_items_service');
        const schema = schema_validations_1.default
            .post_inventory_items_schema()
            .validate(req.body);
        // checking schema error  present or not if there throwing error
        if (schema.error) {
            req.logger.error('user entered invalid data');
            throw new custom_error_1.default(schema.error.message, status_codes_1.default.bad_request);
        }
        req.logger.info('user entering into database');
        const data = (yield inventory_items_queries_1.default.post_items_on_inventory(inventory_id, item_ids, req)) ||
            undefined ||
            Error;
        if (data.code === '22P02') {
            req.logger.error('post items_inventory failed due to invalid coloumn');
            throw new custom_error_1.default(error_message_1.default.bad_request, status_codes_1.default.bad_request);
        }
        if (data instanceof Error) {
            req.logger.error('post items_inventory failed due to error occured in database');
            throw new custom_error_1.default(error_message_1.default.internal_error, status_codes_1.default.internal_error);
        }
    });
}
function filter_items_service(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const inventory_id = req.headers.inventory_id;
        req.logger.info('user request in filter_items_service');
        if (!inventory_id || typeof inventory_id !== 'string') {
            req.logger.error('user enterd wrong invalid inventory_id');
            const error = new custom_error_1.default(error_message_1.default.invalid_inventory_id, status_codes_1.default.bad_request);
            throw error;
        }
        // checking whether query parameter present or not
        if (Object.keys(req.query).length === 0) {
            req.logger.error('user is not enterd any filter');
            const error = new custom_error_1.default(error_message_1.default.empty_filter_query, status_codes_1.default.bad_request);
            throw error;
        }
        req.logger.info('user entering to database');
        const filtered_result = yield inventory_items_queries_1.default.filter_items(req.query, inventory_id, req);
        req.logger.info('got the data from searched result');
        // checking searched result is empty or not if empty throw error with 404
        if (Object.keys(filtered_result).length === 0) {
            req.logger.error('filtered query result is empty');
            const error = new custom_error_1.default(error_message_1.default.filter_not_found, status_codes_1.default.not_found);
            throw error;
        }
        req.logger.info('request filtered successfully sending to filter_controllers');
        return filtered_result;
    });
}
function search_items_service(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = req.query.q || '';
        const inventory_id = req.headers.inventory_id;
        req.logger.info('user request entered into search items service');
        if (!inventory_id || typeof inventory_id !== 'string') {
            req.logger.info('user provided invalid invntory id');
            const error = new custom_error_1.default(error_message_1.default.invalid_inventory_id, status_codes_1.default.bad_request);
            throw error;
        }
        const items = yield inventory_items_queries_1.default.search_items(query, inventory_id, req);
        req.logger.info('successfully got search items fromn database');
        if (items.length == 0) {
            req.logger.error('user requested items or not found');
            const error = new custom_error_1.default(error_message_1.default.empty_search, status_codes_1.default.not_found);
            throw error;
        }
        req.logger.info('search service successfull and response to controller');
        return items;
    });
}
function place_order_service(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { inventory_id, item_ids } = req.body;
        req.logger.info('user entered into place_order_Service');
        const schema = schema_validations_1.default
            .post_inventory_items_schema()
            .validate(req.body);
        if (schema.error) {
            req.logger.error('user entered wrong inputs');
            const error = new custom_error_1.default(schema.error.message, status_codes_1.default.bad_request);
            throw error;
        }
        // create order id to be unique among all products which are ordered
        const order_id = (0, uuid_1.v4)();
        req.logger.info('ordered id created by uuid');
        // getting token from headers and getting user object from database
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const decoded_data = utils_1.default.verifyJWT(token);
        const user = yield user_queries_1.default.get_user_by_email(decoded_data.email, req);
        req.logger.info('got token from headers and decoded with jwtverify and got user by email');
        // getting inventory items from based on inventory id and item_ids
        const inventory_items_data = yield inventory_items_queries_1.default.get_inventory_items_data(item_ids, inventory_id, req);
        req.logger.info('got inventory_items form database ');
        //sorting both arrays inventory_items and item_ids t based on item_id
        inventory_items_data.sort((a, b) => a.item_id - b.item_id);
        item_ids.sort((a, b) => a.item_id - b.item_id);
        // checking qunatity availability for current orders
        let check_quantity = true;
        let item_not_available_enough = '';
        // calculating total price based on price and quantity
        req.logger.info('total price of items are calculating');
        const total_price = inventory_items_data.reduce((acc, elm, index) => {
            if (elm.qty < item_ids[index].qty && check_quantity) {
                check_quantity = false;
                item_not_available_enough = elm.item_name;
            }
            return acc + elm.price * item_ids[index].qty;
        }, 0);
        // throwing error if quantity is less
        if (!check_quantity) {
            req.logger.error('quantity is not have enough to buy' + item_not_available_enough);
            const error = new custom_error_1.default(`${item_not_available_enough} ${error_message_1.default.less_qunatity}`, status_codes_1.default.not_acceptable);
            throw error;
        }
        //checking user balance more than total price or not
        if (user.balance < total_price) {
            req.logger.error('user dont have enough balance to buy');
            const error = new custom_error_1.default(error_message_1.default.less_balance, status_codes_1.default.payment_required);
            throw error;
        }
        yield user_queries_1.default.update_user_balance(user.email, total_price, req);
        //  const { order_id, inventory_id, user_id } = data
        const ordered_items = item_ids.map((item) => ({
            item_id: item.item_id,
            inventory_id,
            order_id,
            user_id: user.user_id,
            qty: item.qty,
        }));
        const placed_items = yield inventory_items_queries_1.default.post_ordered_items(ordered_items, req);
        req.logger.info('user request performed post_ordered_items query');
        yield inventory_items_queries_1.default.update_inventory_items_qty(inventory_id, item_ids, req);
        req.logger.info('user request updated inventory items qty and sending placed items to controllers');
        return placed_items;
    });
}
exports.default = {
    post_inventory_items_service,
    filter_items_service,
    search_items_service,
    place_order_service,
};
