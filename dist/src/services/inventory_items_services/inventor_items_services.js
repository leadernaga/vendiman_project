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
const status_codes_2 = __importDefault(require("../../utils/Errors/status_codes"));
const uuid_1 = require("uuid");
const utils_1 = __importDefault(require("../../utils/utils"));
const user_queries_1 = __importDefault(require("../../queries/user_queries.ts/user_queries"));
function post_inventory_items_service(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let { inventory_id, item_ids } = req.body;
        // input req.body validating through joi validate function
        const schema = schema_validations_1.default
            .post_inventory_items_schema()
            .validate(req.body);
        // checking schema error  present or not if there throwing error
        if (schema.error) {
            throw new custom_error_1.default(schema.error.message, status_codes_1.default.bad_request);
        }
        const data = yield inventory_items_queries_1.default.post_items_on_inventory(inventory_id, item_ids);
        if (data instanceof Error) {
            const error = new custom_error_1.default(error_message_1.default.bad_request, status_codes_2.default.bad_request);
            throw error;
        }
    });
}
function filter_items_service(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const inventory_id = req.body.inventory_id;
        if (!inventory_id || typeof inventory_id !== 'string') {
            const error = new custom_error_1.default(error_message_1.default.invalid_inventory_id, status_codes_1.default.bad_request);
            throw error;
        }
        // checking whether query parameter present or not
        if (Object.keys(req.query).length === 0) {
            const error = new custom_error_1.default(error_message_1.default.empty_filter_query, status_codes_1.default.bad_request);
            throw error;
        }
        const search_result = yield inventory_items_queries_1.default.filter_items(req.query, inventory_id);
        // checking searched result is empty or not if empty throw error with 404
        if (Object.keys(search_result).length === 0) {
            const error = new custom_error_1.default(error_message_1.default.filter_not_found, status_codes_1.default.not_found);
            throw error;
        }
        return search_result;
    });
}
function search_items_service(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = req.query.q || '';
        const inventory_id = req.body.inventory_id;
        if (!inventory_id || typeof inventory_id !== 'string') {
            const error = new custom_error_1.default(error_message_1.default.invalid_inventory_id, status_codes_1.default.bad_request);
            throw error;
        }
        const items = yield inventory_items_queries_1.default.search_items(query, inventory_id);
        if (items.length == 0) {
            const error = new custom_error_1.default(error_message_1.default.empty_search, status_codes_1.default.not_found);
            throw error;
        }
        return items;
    });
}
function place_order_service(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let { inventory_id, item_ids } = req.body;
        const schema = schema_validations_1.default
            .post_inventory_items_schema()
            .validate(req.body);
        if (schema.error) {
            const error = new custom_error_1.default(schema.error.message, status_codes_1.default.bad_request);
            throw error;
        }
        // create order id to be unique among all products which are ordered
        const order_id = (0, uuid_1.v4)();
        // getting token from headers and getting user object from database
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const decoded_data = utils_1.default.verifyJWT(token);
        const user = yield user_queries_1.default.get_user_by_email(decoded_data.email);
        // getting inventory items from based on inventory id and item_ids
        const inventory_items_data = yield inventory_items_queries_1.default.get_inventory_items_data(item_ids, inventory_id);
        //sorting both arrays inventory_items and item_ids t based on item_id
        inventory_items_data.sort((a, b) => {
            return a.item_id - b.item_id;
        });
        item_ids.sort((a, b) => {
            return a.item_id - b.item_id;
        });
        // checking qunatity availability for current orders
        let check_quantity = true;
        let item_not_available_enough = '';
        // calculating total price based on price and quantity
        const total_price = inventory_items_data.reduce((acc, elm, index) => {
            if (elm.qty < item_ids[index].qty && check_quantity) {
                check_quantity = false;
                item_not_available_enough = elm.item_name;
            }
            return acc + elm.price * item_ids[index].qty;
        }, 0);
        // throwing error if quantity is less
        if (!check_quantity) {
            const error = new custom_error_1.default(`${item_not_available_enough} ${error_message_1.default.less_qunatity}`, status_codes_1.default.not_acceptable);
            throw error;
        }
        //checking user balance more than total price or not
        if (user.balance < total_price) {
            const error = new custom_error_1.default(error_message_1.default.less_balance, status_codes_1.default.payment_required);
            throw error;
        }
        const updated_user_data = yield user_queries_1.default.update_user_balance(user.email, total_price);
        const placed_items = yield inventory_items_queries_1.default.post_ordered_items({
            order_id,
            item_ids,
            inventory_id,
            user_id: user.user_id,
        });
        const updated_inventory_items = yield inventory_items_queries_1.default.update_inventory_items_qty(inventory_id, item_ids);
        return placed_items;
    });
}
exports.default = {
    post_inventory_items_service,
    filter_items_service,
    search_items_service,
    place_order_service,
};
