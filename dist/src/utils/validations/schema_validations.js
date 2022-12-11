"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
function post_inventory_items_schema() {
    const schema = joi_1.default.object({
        inventory_id: joi_1.default.string().required(),
        item_ids: joi_1.default
            .array()
            .items(joi_1.default
            .object({
            item_id: joi_1.default.string().required(),
            qty: joi_1.default.number().required(),
        })
            .required())
            .required(),
    });
    return schema;
}
exports.default = { post_inventory_items_schema };
