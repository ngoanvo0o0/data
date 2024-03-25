"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.handle404 = exports.CustomError = void 0;
const tsoa_1 = require("tsoa");
const Logger_1 = __importDefault(require("./shared/Logger"));
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
const handle404 = (app) => {
    app.use(function notFoundHandler(_req, res) {
        res.status(404).send({
            message: "Not Found",
        });
    });
};
exports.handle404 = handle404;
const handleError = (app) => {
    app.use(function errorHandler(err, req, res, next) {
        Logger_1.default.err(err, true);
        if (err instanceof tsoa_1.ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(400).json({
                message: "Validation Failed",
                details: err === null || err === void 0 ? void 0 : err.fields,
            });
        }
        if (err instanceof CustomError) {
            return res.status(err.statusCode).json({
                message: err.message,
            });
        }
        if (err.status === 401) {
            return res.status(401).json({
                message: "Unauthorize",
            });
        }
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
        next();
    });
};
exports.handleError = handleError;
