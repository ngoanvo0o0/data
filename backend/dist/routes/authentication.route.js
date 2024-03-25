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
exports.routes = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const user_repository_1 = require("../repositories/user.repository");
const errorHandler_1 = require("../errorHandler");
const authentication_service_1 = require("../services/authentication.service");
exports.routes = express_1.Router();
const FINISH_SSO_URL = process.env.FINISH_SSO_URL || "";
exports.routes.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
exports.routes.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/error" }), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = req.user;
        const id = profile.id;
        const email = profile.email;
        let user = yield user_repository_1.getUser({ where: { googleId: id, isDeleted: false } });
        if (!user) {
            if (!email)
                throw new errorHandler_1.CustomError("Invalid email", 400);
            user = yield user_repository_1.getUser({ where: { email: email } });
            if (user) {
                yield user.update({ googleId: id, isDeleted: false });
            }
            else {
                const newUser = {
                    email: email,
                    name: profile.displayName,
                    googleId: id,
                };
                user = yield user_repository_1.createUser(newUser);
            }
        }
        const secretToken = yield authentication_service_1.generateUserSecret(user.id);
        res.redirect(`${FINISH_SSO_URL}?token=${secretToken.token}&id=${secretToken.id}`);
    });
});
exports.routes.get("/facebook", passport_1.default.authenticate("facebook", {
    scope: ["public_profile", "email"],
}));
exports.routes.get("/facebook/callback", passport_1.default.authenticate("facebook", {
    failureRedirect: "/error",
}), function (req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const profile = req.user;
        const id = profile.id;
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        let user = yield user_repository_1.getUser({ where: { facebookId: id, isDeleted: false } });
        if (!user) {
            if (!email)
                throw new errorHandler_1.CustomError("Invalid email", 400);
            user = yield user_repository_1.getUser({ where: { email: email } });
            if (user) {
                yield user.update({ facebookId: id, isDeleted: false });
            }
            else {
                const newUser = {
                    email: email,
                    name: profile.displayName || "",
                    facebookId: id,
                };
                user = yield user_repository_1.createUser(newUser);
            }
        }
        const secretToken = yield authentication_service_1.generateUserSecret(user.id);
        res.redirect(`${FINISH_SSO_URL}?token=${secretToken.token}&id=${secretToken.id}`);
    });
});
