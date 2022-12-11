"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class custom_errors extends Error {
    constructor(message, status) {
        super(message);
        this.status = 500;
        this.status = status;
        this.message = message;
    }
}
exports.default = custom_errors;
