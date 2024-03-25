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
exports.AdminConsoleMenuService = void 0;
const errorHandler_1 = require("../../errorHandler");
const init_models_1 = require("../../models/init-models");
const function_1 = require("../../shared/function");
const sequelize_1 = require("sequelize");
const histories_service_1 = require("./histories.service");
const history_dto_1 = require("../../dtos/history.dto");
class AdminConsoleMenuService {
    getMenus() {
        return __awaiter(this, void 0, void 0, function* () {
            const menus = yield init_models_1.Menu.findAll({
                where: {
                    isDeleted: false
                },
                order: [
                    ['order', 'ASC']
                ],
                include: [{
                        model: init_models_1.Categories,
                        as: 'category',
                        where: {
                            isDeleted: false
                        },
                        required: false
                    }]
            });
            const parentIdList = menus.filter(x => x.categoryId).map((menu) => menu.categoryId);
            const childCategories = yield init_models_1.Categories.findAll({
                where: {
                    isDeleted: false,
                    [sequelize_1.Op.and]: [
                        { parentId: { [sequelize_1.Op.not]: null } },
                        { parentId: { [sequelize_1.Op.in]: parentIdList } }
                    ]
                }
            });
            const childCategoryGroups = childCategories.reduce((acc, cur) => {
                if (!acc[cur.parentId]) {
                    acc[cur.parentId] = [];
                }
                acc[cur.parentId].push(cur);
                return acc;
            }, {});
            const menusMapped = menus.map((menu) => {
                var _a, _b, _c, _d;
                return ({
                    id: menu.id,
                    order: menu.order,
                    name: menu.name,
                    categoryId: menu.categoryId,
                    categoryName: (_a = menu.category) === null || _a === void 0 ? void 0 : _a.name,
                    createdAt: menu.createdAt,
                    createdBy: menu.createdBy,
                    slug: (_b = menu.category) === null || _b === void 0 ? void 0 : _b.slug,
                    childCategories: (_d = (_c = childCategoryGroups[menu.categoryId]) === null || _c === void 0 ? void 0 : _c.map((childCategory) => mapCategory(childCategory))) !== null && _d !== void 0 ? _d : []
                });
            });
            return { data: menusMapped };
        });
    }
    getMenusById(menuId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield init_models_1.Menu.findOne({
                where: {
                    isDeleted: false,
                    id: menuId
                },
                include: [{
                        model: init_models_1.Categories,
                        as: 'category',
                        where: {
                            isDeleted: false
                        },
                        required: false
                    }],
                order: [
                    ['updated_at', 'DESC']
                ]
            });
            if (!menu) {
                throw new errorHandler_1.CustomError('Menu not found', 400);
            }
            let userNameUpdated = '';
            if (menu.updatedBy) {
                const findUserUpdated = yield init_models_1.Users.findOne({
                    where: {
                        isDeleted: false,
                        id: menu.updatedBy
                    }
                });
                userNameUpdated = (_a = findUserUpdated === null || findUserUpdated === void 0 ? void 0 : findUserUpdated.name) !== null && _a !== void 0 ? _a : '';
            }
            const menuObject = {
                id: menu.id,
                order: menu.order,
                name: menu.name,
                categoryId: menu.categoryId,
                categoryName: (_b = menu.category) === null || _b === void 0 ? void 0 : _b.name,
                createdAt: menu.createdAt,
                createdBy: menu.createdBy,
                userNameUpdated,
                updatedAt: menu.updatedAt
            };
            return { data: menuObject };
        });
    }
    upsertMenu(menuRequest, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let slug = undefined;
            if (!menuRequest.id && menuRequest.name) {
                slug = function_1.generateSlug(menuRequest.name);
            }
            const [menu] = yield init_models_1.Menu.upsert({
                id: menuRequest.id,
                categoryId: menuRequest.categoryId,
                name: menuRequest.name,
                order: menuRequest.order,
                slug,
                createdBy: !menuRequest.id ? currentUser : undefined,
                updatedBy: currentUser
            });
            if (menuRequest.id === menu.id) {
                histories_service_1.logUpdate(currentUser, menu.id, menu.name, history_dto_1.HistoryEntityType.Menu);
            }
            else {
                histories_service_1.logCreation(currentUser, menu.id, menu.name, history_dto_1.HistoryEntityType.Menu);
            }
            return {
                data: {
                    id: menu.id,
                    name: menu.name
                }
            };
        });
    }
    deleteMenu(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield init_models_1.Menu.findByPk(menuId);
            if (!(menu === null || menu === void 0 ? void 0 : menu.id)) {
                throw new errorHandler_1.CustomError('Menu not found', 400);
            }
            menu.isDeleted = true;
            menu.updatedAt = new Date();
            yield menu.save();
        });
    }
}
exports.AdminConsoleMenuService = AdminConsoleMenuService;
function mapCategory(category) {
    return {
        id: category.id,
        name: category.name,
        parentId: category.parentId,
        status: category.status,
        type: category.type,
        styleShow: category.styleShow,
        slug: category.slug
    };
}
