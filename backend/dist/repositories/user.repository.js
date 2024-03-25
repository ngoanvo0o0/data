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
exports.createUser = exports.getUserByEmail = exports.getUser = void 0;
const Users_1 = require("../models/Users");
function getUser(condition) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Users_1.Users.findOne(condition);
    });
}
exports.getUser = getUser;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Users_1.Users.findOne({ where: { email } });
    });
}
exports.getUserByEmail = getUserByEmail;
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Users_1.Users.create(user);
    });
}
exports.createUser = createUser;
