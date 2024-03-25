"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressAuthentication = void 0;
const token_helper_1 = require("../helpers/token.helper");
const errorHandler_1 = require("../errorHandler");
const HEADER_NAME = "authorization";
const TOKEN_PREFIX = "Bearer ";
function expressAuthentication(request, securityName, scopes) {
    const token = extractTokenFromHeader(request);
    if (!token)
        return Promise.reject(new errorHandler_1.CustomError("Unauthenticated", 401));
    try {
        const decoded = token_helper_1.verifyToken(token);
        if (typeof decoded === "string")
            return Promise.reject(new errorHandler_1.CustomError("Unauthenticated", 401));
        if (scopes && scopes.length > 0) {
            if (scopes.every((scope) => !decoded.scopes.includes(scope))) {
                return Promise.reject(new errorHandler_1.CustomError("Unauthorized", 403));
            }
        }
        request.authInfo = decoded;
        return Promise.resolve(decoded);
    }
    catch (_) {
        return Promise.reject(new errorHandler_1.CustomError("Unauthenticated", 401));
    }
}
exports.expressAuthentication = expressAuthentication;
function extractTokenFromHeader(request) {
    const tokenBearer = request.header(HEADER_NAME);
    if (!tokenBearer)
        return null;
    if (!tokenBearer.startsWith(TOKEN_PREFIX))
        return null;
    return tokenBearer.substring(TOKEN_PREFIX.length);
}
