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
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashSecret = exports.generateUserSecret = exports.signInWithToken = exports.revoke = exports.refreshToken = exports.signIn = exports.signUp = void 0;
const bcrypt_1 = require("bcrypt");
const errorHandler_1 = require("../errorHandler");
const token_helper_1 = require("../helpers/token.helper");
const init_models_1 = require("../models/init-models");
const uuidv4_1 = require("uuidv4");
const crypto_1 = require("crypto");
const histories_service_1 = require("./admin-console/histories.service");
const secretTokens = [];
function signUp(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundUser = yield init_models_1.Users.findOne({
            where: {
                email: input.email,
            },
        });
        if (foundUser && !foundUser.isDeleted) {
            throw new errorHandler_1.CustomError("User already exists", 400);
        }
        const hashedPassword = yield hashSecret(input.password);
        // const findRole = await Roles.findOne({
        //   where: {
        //     key: input.userType,
        //   },
        // });
        // if (!findRole) {
        //   throw new CustomError("User type does not exits", 400);
        // }
        const [user] = yield init_models_1.Users.upsert({
            id: (foundUser === null || foundUser === void 0 ? void 0 : foundUser.id) || uuidv4_1.uuid(),
            email: input.email,
            password: hashedPassword,
            name: input.name,
            isDeleted: false,
            // roleId: findRole.id,
        });
        // const findPermissions = await RolePermissions.findAll({
        //   where: {
        //     roleId: findRole.id,
        //   },
        //   include: {
        //     model: Permissions,
        //     as: "permission",
        //   },
        // });
        const authInfo = {
            userId: user.id,
            sub: user.email,
            scopes: [], //findPermissions?.map((e) => e.permission.name || ""),
        };
        return {
            token: token_helper_1.generateToken(authInfo),
            refreshToken: "",
            userInfo: user && {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    });
}
exports.signUp = signUp;
function signIn(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundUser = yield init_models_1.Users.findOne({
            where: {
                email: input.email,
                isDeleted: false,
            },
        });
        if (!foundUser) {
            throw new errorHandler_1.CustomError("Invalid Credentials", 400);
        }
        const isPasswordValid = yield comparePasswords(input.password, foundUser.password);
        if (!isPasswordValid) {
            throw new errorHandler_1.CustomError("Invalid Credentials", 400);
        }
        if (foundUser.roleId) {
            histories_service_1.logHistory(foundUser.id, "login");
        }
        const userPrincipal = yield getUserPrincipal(foundUser);
        const userToken = yield generateUserToken(foundUser, userPrincipal);
        if (input.isRememberMe) {
            const refreshToken = token_helper_1.generateRefreshToken(userPrincipal);
            yield foundUser.update({ refreshToken });
            userToken.refreshToken = refreshToken;
        }
        return userToken;
    });
}
exports.signIn = signIn;
function refreshToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = token_helper_1.verifyRefreshToken(token);
            if (typeof decoded === "string")
                throw new errorHandler_1.CustomError("Unauthenticated", 401);
            const userInfo = decoded;
            const foundUser = yield init_models_1.Users.findByPk(userInfo.userId);
            if (!foundUser) {
                throw new errorHandler_1.CustomError("Unauthenticated", 401);
            }
            if (foundUser.refreshToken !== token) {
                yield foundUser.update({ refreshToken: null });
                throw new errorHandler_1.CustomError("Unauthenticated", 401);
            }
            return yield generateUserToken(foundUser);
        }
        catch (_) {
            throw new errorHandler_1.CustomError("Unauthenticated", 401);
        }
    });
}
exports.refreshToken = refreshToken;
function revoke(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield init_models_1.Users.findByPk(userId);
        if (user) {
            yield user.update({ refreshToken: null });
        }
    });
}
exports.revoke = revoke;
function signInWithToken(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretIndex = secretTokens.findIndex((x) => x.token === input.token);
        if (secretIndex < 0) {
            throw new errorHandler_1.CustomError("Invalid Credentials", 400);
        }
        const secret = secretTokens[secretIndex];
        secretTokens.splice(secretIndex, 1);
        if (secret.id !== input.id) {
            throw new errorHandler_1.CustomError("Invalid Credentials", 400);
        }
        const foundUser = yield init_models_1.Users.findOne({
            where: {
                id: input.id,
                isDeleted: false,
            },
        });
        if (!foundUser) {
            throw new errorHandler_1.CustomError("Invalid Credentials", 400);
        }
        if (secret.token !== input.token) {
            throw new errorHandler_1.CustomError("Invalid Credentials", 400);
        }
        return yield generateUserToken(foundUser);
    });
}
exports.signInWithToken = signInWithToken;
function generateUserToken(user, authInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authInfo) {
            authInfo = yield getUserPrincipal(user);
        }
        const role = yield user.getRole();
        return {
            token: token_helper_1.generateToken(authInfo),
            refreshToken: "",
            role: role && {
                id: role.id,
                name: role.name || "",
            },
            userInfo: user && {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    });
}
function getUserPrincipal(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const findPermissions = yield init_models_1.RolePermissions.findAll({
            where: {
                roleId: user.roleId,
            },
            include: {
                model: init_models_1.Permissions,
                as: "permission",
            },
        });
        return {
            userId: user.id,
            sub: user.email,
            scopes: findPermissions === null || findPermissions === void 0 ? void 0 : findPermissions.map((e) => e.permission.name || ""),
        };
    });
}
function generateUserSecret(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield generateSecretToken();
        const secret = {
            id: userId,
            token,
        };
        secretTokens.push(secret);
        return secret;
    });
}
exports.generateUserSecret = generateUserSecret;
function generateSecretToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = crypto_1.randomBytes(32).toString("hex");
        return yield hashSecret(token);
    });
}
function hashSecret(value) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 16;
        return yield bcrypt_1.hash(value, saltRounds);
    });
}
exports.hashSecret = hashSecret;
function comparePasswords(plainPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.compare(plainPassword, hashedPassword);
    });
}
exports.comparePasswords = comparePasswords;
