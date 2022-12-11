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
function post_inventory_items_serive(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let { inventory_id, item_ids } = req.body;
        const schema = schema_validations_1.default
            .post_inventory_items_schema()
            .validate(req.body);
        if (schema.error) {
            throw new custom_error_1.default(schema.error.message, status_codes_1.default.bad_request);
        }
        if (Array.isArray(item_ids) == false) {
            item_ids = [item_ids];
        }
        return yield inventory_items_queries_1.default.post_items_on_inventory(inventory_id, item_ids);
    });
}
