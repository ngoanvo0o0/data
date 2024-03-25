"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyToken = exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const env = process.env;
const jwtOptions = {
    expiresIn: env.TOKEN_LIFETIME,
    algorithm: env.TOKEN_ALGORITHM || "HS256",
    issuer: env.TOKEN_ISSUER,
    audience: env.TOKEN_AUDIENCE,
};
const refreshTokenOptions = {
    expiresIn: env.REFRESH_TOKEN_LIFETIME,
    algorithm: env.TOKEN_ALGORITHM || "HS256",
    issuer: env.TOKEN_ISSUER,
    audience: env.TOKEN_AUDIENCE,
};
function generateToken(payload) {
    const secret = process.env.TOKEN_SECRET || "";
    return jsonwebtoken_1.sign(payload, secret, jwtOptions);
}
exports.generateToken = generateToken;
function generateRefreshToken(payload) {
    const secret = process.env.REFRESH_TOKEN_SECRET || "";
    return jsonwebtoken_1.sign(payload, secret, refreshTokenOptions);
}
exports.generateRefreshToken = generateRefreshToken;
function verifyToken(token) {
    const secret = process.env.TOKEN_SECRET || "";
    return jsonwebtoken_1.verify(token, secret, jwtOptions);
}
exports.verifyToken = verifyToken;
function verifyRefreshToken(token) {
    const secret = process.env.REFRESH_TOKEN_SECRET || "";
    return jsonwebtoken_1.verify(token, secret, refreshTokenOptions);
}
exports.verifyRefreshToken = verifyRefreshToken;
