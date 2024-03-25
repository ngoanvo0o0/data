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
exports.AdminConsoleUSerService = void 0;
const Users_1 = require("../../models/Users");
const errorHandler_1 = require("../../errorHandler");
const sequelize_1 = require("sequelize");
const uuidv4_1 = require("uuidv4");
const lodash_1 = require("lodash");
const histories_service_1 = require("./histories.service");
const history_dto_1 = require("../../dtos/history.dto");
class AdminConsoleUSerService {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield Users_1.Users.findAll({
                where: {
                    isDeleted: false,
                    roleId: {
                        [sequelize_1.Op.eq]: null
                    }
                },
                order: [['updated_at', 'DESC']]
            });
            const usersMapped = users.map((user) => {
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    bio: user.bio,
                    status: user.status,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt,
                    facebookId: user.facebookId,
                    googleId: user.googleId
                };
            });
            return { data: usersMapped };
        });
    }
    getUsersById(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield Users_1.Users.findOne({
                where: {
                    isDeleted: false,
                    id: userId
                }
            });
            if (!userModel) {
                throw new errorHandler_1.CustomError('User not found', 400);
            }
            let userNameUpdated = '';
            if (userModel.updatedBy) {
                const findUserUpdated = yield Users_1.Users.findOne({
                    where: {
                        isDeleted: false,
                        id: userModel.updatedBy
                    }
                });
                userNameUpdated = (_a = findUserUpdated === null || findUserUpdated === void 0 ? void 0 : findUserUpdated.name) !== null && _a !== void 0 ? _a : '';
            }
            const user = {
                id: userModel.id,
                email: userModel.email,
                name: userModel.name,
                bio: userModel.bio,
                status: userModel.status,
                phoneNumber: userModel.phoneNumber,
                createdAt: userModel.createdAt,
                roleId: userModel.roleId,
                userNameUpdated,
                updatedAt: userModel.updatedAt
            };
            return { data: user };
        });
    }
    upsertUser(userRequest, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = userRequest.id;
            if (!userId) {
                userId = uuidv4_1.uuid();
            }
            const countEmailExisting = yield Users_1.Users.count({
                where: {
                    isDeleted: false,
                    email: {
                        [sequelize_1.Op.iLike]: userRequest.email
                    },
                    id: {
                        [sequelize_1.Op.ne]: userId
                    }
                }
            });
            if (countEmailExisting > 0) {
                throw new errorHandler_1.CustomError('This email already exists in the system. Please enter another email.', 400);
            }
            const randomAvatarNum = lodash_1.random(0, 6);
            const [user] = yield Users_1.Users.upsert({
                id: userRequest.id,
                name: userRequest.fullName,
                email: !userRequest.id ? userRequest.email : undefined,
                status: userRequest.status,
                roleId: userRequest.roleId,
                // phoneNumber: userRequest.phoneNumber,
                updatedAt: new Date(),
                createdBy: !userRequest.id ? currentUser : undefined,
                updatedBy: currentUser,
                avatar: `/img/authorAvatar/c${randomAvatarNum}.png`,
                isDeleted: false,
            }, {
                returning: true
            });
            if (userRequest.id === user.id) {
                histories_service_1.logUpdate(currentUser, user.id, user.name, history_dto_1.HistoryEntityType.User);
            }
            else {
                histories_service_1.logCreation(currentUser, user.id, user.name, history_dto_1.HistoryEntityType.User);
            }
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber
            };
        });
    }
    deleteUser(userId, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.Users.findByPk(userId);
            if (!user) {
                throw new errorHandler_1.CustomError('Not found user', 400);
            }
            user.isDeleted = true;
            user.updatedBy = currentUser;
            user.updatedAt = new Date();
            user.save();
            histories_service_1.logDeletion(currentUser, user.id, user.name, history_dto_1.HistoryEntityType.User);
        });
    }
}
exports.AdminConsoleUSerService = AdminConsoleUSerService;
