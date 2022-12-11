"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controllers_1 = __importDefault(require("../../controllers/inventory_controllers/inventory_controllers"));
const inventory_items_controllers_1 = __importDefault(require("../../controllers/inventory_items_controllers/inventory_items_controllers"));
const auth_middlewere_1 = __importDefault(require("../../middleweres/Auth/auth_middlewere"));
const route = (0, express_1.Router)();
route.get('/', inventory_controllers_1.default.get_list_of_inventories);
route.get('/filter', inventory_items_controllers_1.default.filter_items);
route.get('/search', inventory_items_controllers_1.default.search_items);
route.post('/place_order', auth_middlewere_1.default.auth_middlewere, inventory_items_controllers_1.default.place_order);
route.post('/items', auth_middlewere_1.default.admin_middlewere, inventory_items_controllers_1.default.post_inventory_items);
route.put('/items', auth_middlewere_1.default.admin_middlewere, inventory_items_controllers_1.default.post_inventory_items);
exports.default = route;
