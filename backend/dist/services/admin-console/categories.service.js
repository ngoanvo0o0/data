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
exports.AdminConsoleCategoryService = void 0;
const Categories_1 = require("../../models/Categories");
const errorHandler_1 = require("../../errorHandler");
const Users_1 = require("../../models/Users");
const function_1 = require("../../shared/function");
const histories_service_1 = require("./histories.service");
const history_dto_1 = require("../../dtos/history.dto");
class AdminConsoleCategoryService {
    getCategories(queryParams, onlyParent) {
        return __awaiter(this, void 0, void 0, function* () {
            const slugCondition = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.slug) ? { slug: queryParams.slug } : {};
            let categories = yield Categories_1.Categories.findAll({
                where: Object.assign({ isDeleted: false }, slugCondition),
                include: [{
                        model: Categories_1.Categories,
                        as: 'parent',
                        where: {
                            isDeleted: false
                        },
                        required: false
                    }],
                order: [['updated_at', 'DESC']]
            });
            if (onlyParent) {
                categories = categories.filter(e => e.parentId === null);
            }
            const categoriesMapped = categories.map((category) => {
                const parentCategory = category.parent;
                return {
                    id: category.id,
                    name: category.name,
                    status: category.status,
                    type: category.type,
                    styleShow: category.styleShow,
                    createdAt: category.createdAt,
                    parentCategory: parentCategory && {
                        id: parentCategory === null || parentCategory === void 0 ? void 0 : parentCategory.id,
                        name: parentCategory === null || parentCategory === void 0 ? void 0 : parentCategory.name
                    }
                };
            });
            return { data: categoriesMapped };
        });
    }
    getCategorysById(categoryId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const categoryModel = yield Categories_1.Categories.findOne({
                where: {
                    isDeleted: false,
                    id: categoryId
                }
            });
            if (!categoryModel) {
                throw new errorHandler_1.CustomError('Category not found', 400);
            }
            let userNameUpdated = '';
            if (categoryModel.updatedBy) {
                const findUserUpdated = yield Users_1.Users.findOne({
                    where: {
                        isDeleted: false,
                        id: categoryModel.updatedBy
                    }
                });
                userNameUpdated = (_a = findUserUpdated === null || findUserUpdated === void 0 ? void 0 : findUserUpdated.name) !== null && _a !== void 0 ? _a : '';
            }
            return {
                data: {
                    id: categoryModel.id,
                    name: categoryModel.name,
                    categoryParentId: categoryModel.parentId,
                    status: categoryModel.status,
                    type: categoryModel.type,
                    styleShow: categoryModel.styleShow,
                    userNameUpdated,
                    updatedAt: categoryModel.updatedAt
                }
            };
        });
    }
    upsertCategory(categoryRequest, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let slug = undefined;
            if (!categoryRequest.id && categoryRequest.name) {
                slug = function_1.generateSlug(categoryRequest.name);
            }
            const [category, value] = yield Categories_1.Categories.upsert({
                id: categoryRequest.id,
                name: categoryRequest.name,
                parentId: categoryRequest.categoryParentId,
                status: categoryRequest.status,
                type: categoryRequest.type,
                styleShow: categoryRequest.styleShow || null,
                updatedAt: new Date(),
                createdBy: !categoryRequest.id ? currentUser : undefined,
                updatedBy: currentUser,
                slug
            }, {
                returning: true
            });
            if (categoryRequest.id === category.id) {
                histories_service_1.logUpdate(currentUser, category.id, category.name, history_dto_1.HistoryEntityType.Category);
            }
            else {
                histories_service_1.logCreation(currentUser, category.id, category.name, history_dto_1.HistoryEntityType.Category);
            }
            return {
                id: category.id,
                name: category.name
            };
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Categories_1.Categories.findByPk(categoryId);
            if (!category) {
                throw new errorHandler_1.CustomError('Not found Category', 400);
            }
            category.isDeleted = true;
            category.updatedAt = new Date();
            category.save();
        });
    }
    getSelectCategories(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield Categories_1.Categories.findAll({
                where: {
                    isDeleted: false,
                    type: type === 'menu' ? ['news', 'raovat', 'menu'] : type,
                    status: 'active'
                }
            });
            const categoriesMapped = categories.map((category) => {
                return {
                    label: category.name,
                    value: category.id
                };
            });
            return { data: categoriesMapped };
        });
    }
}
exports.AdminConsoleCategoryService = AdminConsoleCategoryService;
