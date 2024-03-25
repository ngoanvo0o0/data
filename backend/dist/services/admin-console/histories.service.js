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
exports.logHistory = exports.logDeletion = exports.logUpdate = exports.logCreation = exports.logVisit = exports.listHistories = void 0;
const UserHistories_1 = require("../../models/UserHistories");
const Users_1 = require("../../models/Users");
function listHistories() {
    return __awaiter(this, void 0, void 0, function* () {
        const ads = yield UserHistories_1.UserHistories.findAll({
            include: { model: Users_1.Users, as: "user" },
            where: { isDeleted: false },
            order: [["updatedAt", "DESC"]],
        });
        ads;
        return ads.map((ad) => mapEntityToDto(ad));
    });
}
exports.listHistories = listHistories;
function mapEntityToDto(history) {
    return {
        id: history.id,
        userName: history.user.name,
        action: history.action,
        entityId: history.id,
        entityName: history.entityName,
        entityType: history.entityType,
        createdDate: history.updatedAt,
    };
}
function logVisit(userId, entityId, entityName, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        yield logHistory(userId, "get", entityId, entityName, entityType);
    });
}
exports.logVisit = logVisit;
function logCreation(userId, entityId, entityName, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        yield logHistory(userId, "create", entityId, entityName, entityType);
    });
}
exports.logCreation = logCreation;
function logUpdate(userId, entityId, entityName, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        yield UserHistories_1.UserHistories.update({ entityName: entityName }, { where: { entityId: entityId } });
        yield logHistory(userId, "update", entityId, entityName, entityType);
    });
}
exports.logUpdate = logUpdate;
function logDeletion(userId, entityId, entityName, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        yield logHistory(userId, "delete", entityId, entityName, entityType);
    });
}
exports.logDeletion = logDeletion;
function logHistory(userId, action, entityId, entityName, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        yield UserHistories_1.UserHistories.create({
            userId: userId,
            action: action,
            entityId: entityId,
            entityName: entityName,
            entityType: entityType,
        });
    });
}
exports.logHistory = logHistory;
