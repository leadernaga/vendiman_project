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
const inventory_services_1 = __importDefault(require("../../services/inventory_services/inventory_services"));
const custom_error_1 = __importDefault(require("../../utils/Errors/custom_error"));
const status_codes_1 = __importDefault(require("../../utils/Errors/status_codes"));
function get_list_of_inventories(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inventory_list = yield inventory_services_1.default.get_inventories_service();
            res.status(200).send(inventory_list);
        }
        catch (err) {
            const error = new custom_error_1.default('something went wrong internally', status_codes_1.default.internal_error);
            next(error);
        }
    });
}
exports.default = {
    get_list_of_inventories,
};
