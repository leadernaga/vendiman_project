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
const inventor_items_services_1 = __importDefault(require("../../services/inventory_items_services/inventor_items_services"));
const status_codes_1 = __importDefault(require("../../utils/Errors/status_codes"));
function post_inventory_items(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.logger.info('user requested to post inventory items and user request in post inventory items controller');
            yield inventor_items_services_1.default.post_inventory_items_service(req);
            req.logger.info('user request for post items is succesfull and response to user');
            res.status(status_codes_1.default.ok).send({ message: 'success' });
        }
        catch (err) {
            req.logger.error('error occured in post_inventory_items_controller');
            next(err);
        }
    });
}
function filter_items(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        req.logger.info('user requested to filter items in inventory and user in filter items controller');
        try {
            req.logger.info('user request entering into filter_items');
            const search_result = yield inventor_items_services_1.default.filter_items_service(req);
            req.logger.info('user request is successfull sending response to user');
            res.status(status_codes_1.default.ok).send({
                data: search_result,
                message: 'success',
            });
        }
        catch (err) {
            req.logger.info('filter items controller got error');
            next(err);
        }
    });
}
function search_items(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        req.logger.info('user requested to search items and user entered into search items controller');
        try {
            const items = yield inventor_items_services_1.default.search_items_service(req);
            req.logger.info('user request successfull from database sending response to user');
            res.status(200).send({ data: items, message: 'success' });
        }
        catch (err) {
            req.logger.info('search items got error ');
            next(err);
        }
    });
}
function place_order(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.logger.info('user requested to place order and user into place_order controllers');
            const placed_items = yield inventor_items_services_1.default.place_order_service(req);
            req.logger.info('user ordered placed successfully');
            res.status(status_codes_1.default.ok).send(placed_items);
        }
        catch (err) {
            req.logger.error('error occured in place order controller');
            next(err);
        }
    });
}
exports.default = { post_inventory_items, filter_items, search_items, place_order };
