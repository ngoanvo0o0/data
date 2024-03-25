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
exports.AdminConsoleRaoVatService = void 0;
const errorHandler_1 = require("../../errorHandler");
const init_models_1 = require("../../models/init-models");
const function_1 = require("../../shared/function");
const pagination_dto_1 = require("../../dtos/pagination.dto");
const sequelize_1 = require("sequelize");
const lodash_1 = require("lodash");
const histories_service_1 = require("./histories.service");
const history_dto_1 = require("../../dtos/history.dto");
const Logger_1 = __importDefault(require("../../shared/Logger"));
const host = process.env.HOST || "";
class AdminConsoleRaoVatService {
    getRaoVats() {
        return __awaiter(this, void 0, void 0, function* () {
            const raovats = yield init_models_1.RaoVats.findAll({
                attributes: [
                    'id',
                    'title',
                    'imageurl',
                    'view',
                    'status',
                    ['category_id', 'categoryId'],
                    ['publish_date', 'publishDate'],
                    ['created_at', 'createdAt'],
                    ['created_by', 'createdBy'],
                    ['updated_at', 'updatedAt'],
                    'customId'
                ],
                where: {
                    isDeleted: false
                },
                include: [
                    {
                        model: init_models_1.Categories,
                        as: "category",
                        attributes: [
                            'id',
                            'name'
                        ],
                        where: {
                            isDeleted: false,
                        },
                        required: false,
                    },
                ],
                order: [["created_at", "ASC"]],
            });
            const raovatsMapped = raovats.map((raovat, index) => {
                var _a;
                return ({
                    index: index + 1,
                    id: raovat.id,
                    title: raovat.title,
                    imageUrl: raovat.imageurl && `${host}${raovat.imageurl}`,
                    categoryId: raovat.categoryId,
                    categoryName: (_a = raovat.category) === null || _a === void 0 ? void 0 : _a.name,
                    publishDate: raovat.publishDate,
                    createdAt: raovat.createdAt,
                    createdBy: raovat.createdBy,
                    updatedAt: raovat.updatedAt,
                    view: String(Number(raovat.view || 0)),
                    status: raovat.status,
                    customId: Number(raovat.customId)
                });
            });
            const orderByCreatedAt = lodash_1.orderBy(raovatsMapped, (e) => e.customId, "desc");
            return { data: orderByCreatedAt };
        });
    }
    getRaoVatsById(raoVatId) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const raovat = yield init_models_1.RaoVats.findOne({
                where: {
                    isDeleted: false,
                    id: raoVatId,
                },
                include: [
                    {
                        model: init_models_1.Categories,
                        as: "category",
                        where: {
                            isDeleted: false,
                        },
                        required: false,
                    },
                ],
            });
            if (!raovat) {
                throw new errorHandler_1.CustomError("Rao vat not found", 400);
            }
            let userNameUpdated = "";
            if (raovat.updatedBy) {
                const findUserUpdated = yield init_models_1.Users.findOne({
                    where: {
                        isDeleted: false,
                        id: raovat.updatedBy,
                    },
                });
                userNameUpdated = (_a = findUserUpdated === null || findUserUpdated === void 0 ? void 0 : findUserUpdated.name) !== null && _a !== void 0 ? _a : "";
            }
            const raovatObject = {
                id: raovat.id,
                title: raovat.title,
                content: raovat.content,
                imageUrl: raovat.imageurl && `${host}${raovat.imageurl}`,
                extraImages: (_c = (_b = raovat.extraImages) === null || _b === void 0 ? void 0 : _b.map((x) => `${host}${x}`)) !== null && _c !== void 0 ? _c : [],
                rawExtraImagePaths: (_d = raovat.extraImages) !== null && _d !== void 0 ? _d : [],
                categoryId: raovat.categoryId,
                categoryName: (_e = raovat.category) === null || _e === void 0 ? void 0 : _e.name,
                publishDate: raovat.publishDate,
                createdAt: raovat.createdAt,
                createdBy: raovat.createdBy,
                userNameUpdated,
                facebook: raovat.facebook,
                phoneNumber: raovat.phoneNumber,
                updatedAt: raovat.updatedAt,
                metaKeyword: raovat.metaKeyword,
                contactName: raovat.contactName,
                address: raovat.address,
                email: raovat.email,
                websiteUrl: raovat.websiteUrl,
                description: raovat.description,
                status: raovat.status
            };
            return { data: raovatObject };
        });
    }
    upsertRaoVat(raovatRequest, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let slug = undefined;
            let customId = undefined;
            if (!raovatRequest.id && raovatRequest.title) {
                slug = function_1.generateSlug(raovatRequest.title);
                const findMaxCustomId = yield init_models_1.RaoVats.max('customId');
                Logger_1.default.info('findMaxCustomId: ' + JSON.stringify(findMaxCustomId));
                customId = Number(findMaxCustomId || 0) + 1;
            }
            const [raovat] = yield init_models_1.RaoVats.upsert({
                id: raovatRequest.id,
                categoryId: raovatRequest.categoryId,
                content: raovatRequest.content,
                imageurl: raovatRequest.imageUrl,
                extraImages: raovatRequest.extraImages,
                publishDate: raovatRequest.publishDate,
                title: raovatRequest.title,
                slug,
                createdBy: !raovatRequest.id ? currentUser : undefined,
                updatedBy: currentUser,
                facebook: raovatRequest.facebook,
                phoneNumber: raovatRequest.phoneNumber,
                metaKeyword: raovatRequest.metaKeyword,
                contactName: raovatRequest.contactName,
                websiteUrl: raovatRequest.websiteUrl,
                address: raovatRequest.address,
                email: raovatRequest.email,
                description: raovatRequest.description,
                status: raovatRequest.status,
                customId
            });
            if (raovatRequest.id === raovat.id) {
                histories_service_1.logUpdate(currentUser, raovat.id, raovat.title, history_dto_1.HistoryEntityType.RaoVat);
            }
            else {
                histories_service_1.logCreation(currentUser, raovat.id, raovat.title, history_dto_1.HistoryEntityType.RaoVat);
            }
            return {
                data: {
                    id: raovat.id,
                    title: raovat.title,
                    publishDate: raovat.publishDate,
                },
            };
        });
    }
    deleteRaoVat(raoVatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const raovat = yield init_models_1.RaoVats.findByPk(raoVatId);
            if (!(raovat === null || raovat === void 0 ? void 0 : raovat.id)) {
                throw new errorHandler_1.CustomError("Rao vat not found", 400);
            }
            raovat.isDeleted = true;
            raovat.updatedAt = new Date();
            raovat.updatedBy = userId;
            yield raovat.save();
            histories_service_1.logDeletion(userId, raovat.id, raovat.title, history_dto_1.HistoryEntityType.RaoVat);
        });
    }
    getRaoVatsForWebsite(raoVatRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows, count } = yield init_models_1.RaoVats.findAndCountAll({
                where: {
                    isDeleted: false,
                    status: 'publish'
                },
                offset: (raoVatRequest.page - 1) * raoVatRequest.size,
                limit: raoVatRequest.size,
                include: [
                    {
                        model: init_models_1.Categories,
                        as: "category",
                        where: {
                            isDeleted: false,
                            slug: raoVatRequest.categorySlug
                                ? raoVatRequest.categorySlug
                                : { [sequelize_1.Op.not]: null },
                        },
                        required: true,
                    },
                ],
                order: [["publish_date", "DESC"]],
            });
            const raovatsMapped = rows.map((raovat) => {
                var _a;
                return ({
                    id: raovat.id,
                    title: raovat.title,
                    content: raovat.content,
                    imageUrl: raovat.imageurl && `${host}${raovat.imageurl}`,
                    categoryId: raovat.categoryId,
                    categoryName: (_a = raovat.category) === null || _a === void 0 ? void 0 : _a.name,
                    publishDate: raovat.publishDate,
                    createdAt: raovat.createdAt,
                    createdBy: raovat.createdBy,
                    slug: raovat.slug,
                    metaKeyword: raovat.metaKeyword,
                });
            });
            return new pagination_dto_1.PagedList(raovatsMapped, count, raoVatRequest.page, raoVatRequest.size);
        });
    }
    getRaoVatBySlug(slug) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const raovat = yield init_models_1.RaoVats.findOne({
                where: {
                    isDeleted: false,
                    slug,
                    status: 'publish'
                },
                include: [
                    {
                        model: init_models_1.Categories,
                        as: "category",
                        where: {
                            isDeleted: false,
                        },
                        required: false,
                    },
                ],
            });
            if (!raovat) {
                throw new errorHandler_1.CustomError("Rao vat not found", 400);
            }
            raovat.view = !raovat.view ? '1' : String(Number(raovat.view) + 1);
            yield raovat.save();
            const raovatObject = {
                id: raovat.id,
                title: raovat.title,
                content: raovat.content,
                imageUrl: raovat.imageurl && `${host}${raovat.imageurl}`,
                extraImages: (_b = (_a = raovat.extraImages) === null || _a === void 0 ? void 0 : _a.map((x) => `${host}${x}`)) !== null && _b !== void 0 ? _b : [],
                categoryId: raovat.categoryId,
                categoryName: (_c = raovat.category) === null || _c === void 0 ? void 0 : _c.name,
                publishDate: raovat.publishDate,
                createdAt: raovat.createdAt,
                createdBy: raovat.createdBy,
                slug: raovat.slug,
                facebook: raovat.facebook,
                phoneNumber: raovat.phoneNumber,
                contactName: raovat.contactName,
                websiteUrl: raovat.websiteUrl,
                address: raovat.address,
                email: raovat.email,
                metaKeyword: raovat.metaKeyword,
                description: raovat.description,
            };
            return raovatObject;
        });
    }
    getCategoriesByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield init_models_1.Categories.findAll({
                where: {
                    isDeleted: false,
                    type,
                },
            });
            return categories.map((c) => {
                return {
                    name: c.name,
                    slug: c.slug,
                };
            });
        });
    }
}
exports.AdminConsoleRaoVatService = AdminConsoleRaoVatService;
