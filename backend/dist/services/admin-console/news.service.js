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
exports.AdminConsoleNewsService = void 0;
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
class AdminConsoleNewsService {
    getNews(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows, count } = yield init_models_1.News.findAndCountAll({
                attributes: [
                    'id',
                    'title',
                    'view',
                    ['publish_date', 'publishDate'],
                    ['user_id', 'userId'],
                    'imageurl',
                    'status',
                    'slug',
                    ['is_hot_news', 'isHotNews'],
                    ['created_at', 'createdAt'],
                    ['updated_at', 'updatedAt'],
                    'customId'
                ],
                where: {
                    isDeleted: false,
                    status: pagination.status
                },
                offset: (pagination.page - 1) * pagination.size,
                limit: pagination.size,
                include: [{
                        model: init_models_1.Categories,
                        attributes: [
                            'id', 'name'
                        ],
                        as: 'category',
                        where: {
                            isDeleted: false
                        }
                    }]
            });
            const newsList = rows.map((newsItem, index) => {
                var _a, _b;
                return {
                    index: index + 1,
                    id: newsItem.id,
                    title: newsItem.title,
                    view: newsItem.view,
                    publishDate: newsItem.publishDate,
                    userId: newsItem.userId,
                    categoryId: newsItem.categoryId,
                    categoryName: (_a = newsItem.category) === null || _a === void 0 ? void 0 : _a.name,
                    imageUrl: newsItem.imageurl && `${host}${newsItem.imageurl}`,
                    status: newsItem.status,
                    slug: newsItem.slug,
                    isHotNews: newsItem.isHotNews,
                    author: (_b = newsItem.user) === null || _b === void 0 ? void 0 : _b.name,
                    createdAt: newsItem.createdAt,
                    createdDate: newsItem.createdAt,
                    updatedAt: newsItem.updatedAt,
                    customId: Number(newsItem.customId)
                };
            });
            const orderByCreatedAt = lodash_1.orderBy(newsList, e => e.customId, 'desc');
            return new pagination_dto_1.PagedList(orderByCreatedAt, count, pagination.page, pagination.size);
        });
    }
    getNewsForWebsite(newsesRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryCondition = {};
            const { menuSlug: slug } = newsesRequest;
            let newsCondition = {
                isDeleted: false,
                status: 'publish',
            };
            // eslint-disable-next-line eqeqeq
            if (newsesRequest.isHotNews != null) {
                newsCondition.isHotNews = newsesRequest.isHotNews;
            }
            if (newsesRequest.menuSlug) {
                categoryCondition.condition = {
                    [sequelize_1.Op.or]: [
                        { '$category.slug$': { [sequelize_1.Op.eq]: slug } },
                        { '$category.parent.slug$': { [sequelize_1.Op.eq]: slug } }
                    ]
                };
            }
            if (newsesRequest.search) {
                const search = `%${newsesRequest.search}%`;
                newsCondition = Object.assign(Object.assign({}, newsCondition), { [sequelize_1.Op.or]: [{
                            title: {
                                [sequelize_1.Op.iLike]: search
                            }
                        }, {
                            description: {
                                [sequelize_1.Op.iLike]: search
                            }
                        }, {
                            content: {
                                [sequelize_1.Op.iLike]: search
                            }
                        }] });
            }
            const { rows, count } = yield init_models_1.News.findAndCountAll({
                where: Object.assign(Object.assign({}, newsCondition), categoryCondition.condition),
                offset: (newsesRequest.page - 1) * newsesRequest.size,
                limit: newsesRequest.size,
                include: [{
                        model: init_models_1.Categories,
                        as: 'category',
                        where: {
                            isDeleted: false,
                            status: 'active',
                        },
                        include: [{
                                required: false,
                                model: init_models_1.Categories,
                                as: 'parent',
                                where: {
                                    isDeleted: false,
                                    status: 'active',
                                }
                            }]
                    },
                    {
                        model: init_models_1.Users,
                        as: 'user',
                        // where: {
                        //   isDeleted: false
                        // }
                    }
                ],
                order: [['createdAt', 'desc']]
            });
            const newsList = rows.map((newsItem) => {
                var _a, _b, _c, _d, _e, _f;
                return {
                    id: newsItem.id,
                    title: newsItem.title,
                    description: newsItem.description,
                    content: newsItem.content,
                    publishDate: newsItem.publishDate,
                    userId: newsItem.userId,
                    categoryId: ((_b = (_a = newsItem.category) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.id) || newsItem.categoryId,
                    categoryName: ((_d = (_c = newsItem.category) === null || _c === void 0 ? void 0 : _c.parent) === null || _d === void 0 ? void 0 : _d.name) || ((_e = newsItem.category) === null || _e === void 0 ? void 0 : _e.name),
                    imageUrl: newsItem.imageurl && `${host}${newsItem.imageurl}`,
                    status: newsItem.status,
                    slug: newsItem.slug,
                    isHotNews: newsItem.isHotNews,
                    author: (_f = newsItem.user) === null || _f === void 0 ? void 0 : _f.name,
                    view: newsItem.view,
                    metaKeyword: newsItem.metaKeyword
                };
            });
            return new pagination_dto_1.PagedList(newsList, count, newsesRequest.page, newsesRequest.size);
        });
    }
    getNewsBySlug(slug) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            const news = yield init_models_1.News.findOne({
                where: {
                    isDeleted: false,
                    slug: slug
                },
                include: [{
                        model: init_models_1.NewsTags,
                        as: 'newsTags',
                        where: {
                            isDeleted: false
                        },
                        required: false
                    },
                    {
                        model: init_models_1.Categories,
                        as: 'category',
                        where: {
                            isDeleted: false
                        },
                        include: [{
                                model: init_models_1.Categories,
                                as: 'parent',
                            }]
                    }]
            });
            if (!news) {
                throw new errorHandler_1.CustomError('Not found this news', 400);
            }
            let userNameUpdated = '';
            if (news.updatedBy) {
                const findUserUpdated = yield init_models_1.Users.findOne({
                    where: {
                        isDeleted: false,
                        id: news.updatedBy
                    }
                });
                userNameUpdated = (_a = findUserUpdated === null || findUserUpdated === void 0 ? void 0 : findUserUpdated.name) !== null && _a !== void 0 ? _a : '';
            }
            news.view = !news.view ? '1' : String(Number(news.view) + 1);
            news.save();
            const newsObject = {
                id: news.id,
                title: news.title,
                description: news.description,
                content: news.content,
                publishDate: news.publishDate,
                userId: news.userId,
                categoryId: news.categoryId,
                categoryName: (_b = news.category) === null || _b === void 0 ? void 0 : _b.name,
                parentCategoryId: (_d = (_c = news.category) === null || _c === void 0 ? void 0 : _c.parent) === null || _d === void 0 ? void 0 : _d.id,
                parentCategoryName: (_f = (_e = news.category) === null || _e === void 0 ? void 0 : _e.parent) === null || _f === void 0 ? void 0 : _f.name,
                imageUrl: news.imageurl && `${host}${news.imageurl}`,
                status: news.status,
                slug: news.slug,
                createdAt: news.createdAt,
                tagIds: ((_g = news.newsTags) === null || _g === void 0 ? void 0 : _g.map((newsTag) => newsTag.tagId)) || [],
                isHotNews: news.isHotNews,
                userNameUpdated,
                metaKeyword: news.metaKeyword,
                view: news.view,
                updatedAt: news.updatedAt
            };
            return newsObject;
        });
    }
    upsertNews(newsRequest, currentUser) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let slug = undefined;
            let customId = undefined;
            if (!newsRequest.id && newsRequest.title) {
                slug = function_1.generateSlug(newsRequest.title);
                const findMaxCustomId = yield init_models_1.News.max('customId');
                Logger_1.default.info('findMaxCustomId: ' + JSON.stringify(findMaxCustomId));
                customId = Number(findMaxCustomId || 0) + 1;
            }
            const [news] = yield init_models_1.News.upsert({
                categoryId: newsRequest.categoryId,
                content: newsRequest.content,
                description: newsRequest.description,
                id: newsRequest.id,
                imageurl: newsRequest.imageUrl,
                publishDate: newsRequest.publishDate,
                status: !newsRequest.id ? 'draft' : undefined,
                title: newsRequest.title,
                userId: !newsRequest.id ? currentUser : undefined,
                isHotNews: newsRequest.isHotNews,
                slug,
                updatedAt: new Date(),
                updatedBy: currentUser,
                metaKeyword: newsRequest.metaKeyword,
                view: newsRequest.view,
                customId
            });
            if (newsRequest.id) {
                yield init_models_1.NewsTags.update({
                    isDeleted: true,
                    updatedAt: new Date()
                }, {
                    where: {
                        newsId: news.id
                    }
                });
            }
            const tagsModel = [];
            const newsTagsModel = [];
            const customTags = [];
            const tagIds = [];
            (_a = newsRequest.tagIds) === null || _a === void 0 ? void 0 : _a.filter((tagId) => {
                if (!tagId.match(function_1.regexUuid)) {
                    customTags.push(tagId);
                }
            });
            (_b = newsRequest.tagIds) === null || _b === void 0 ? void 0 : _b.filter((tagId) => {
                if (tagId.match(function_1.regexUuid)) {
                    tagIds.push(tagId);
                }
            });
            for (const customTag of customTags) {
                tagsModel.push({
                    name: customTag,
                    createdBy: currentUser,
                    updatedBy: currentUser
                });
            }
            const tagsCreated = yield init_models_1.Tags.bulkCreate(tagsModel, { returning: true });
            for (const customTagCreated of tagsCreated) {
                tagIds.push(customTagCreated.id);
            }
            for (const tagId of tagIds) {
                newsTagsModel.push({
                    newsId: news.id,
                    tagId
                });
            }
            yield init_models_1.NewsTags.bulkCreate(newsTagsModel, { returning: true });
            if (newsRequest.id === news.id) {
                histories_service_1.logUpdate(currentUser, news.id, news.title, history_dto_1.HistoryEntityType.News);
            }
            else {
                histories_service_1.logCreation(currentUser, news.id, news.title, history_dto_1.HistoryEntityType.News);
            }
            return {
                data: {
                    id: news.id,
                    title: news.title,
                    description: news.description,
                    publishDate: news.publishDate
                }
            };
        });
    }
    deleteNews(newsId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const news = yield init_models_1.News.findByPk(newsId);
            if (!(news === null || news === void 0 ? void 0 : news.id)) {
                throw new errorHandler_1.CustomError('Not found this news', 400);
            }
            news.isDeleted = true;
            news.updatedBy = currentUserId;
            news.updatedAt = new Date();
            yield news.save();
        });
    }
    changeStatusNews(newsId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const news = yield init_models_1.News.findByPk(newsId);
            if (!(news === null || news === void 0 ? void 0 : news.id)) {
                throw new errorHandler_1.CustomError('Not found this news', 400);
            }
            if (news.status === pagination_dto_1.NewStatus.Draft) {
                news.status = pagination_dto_1.NewStatus.Publish;
            }
            else {
                news.status = pagination_dto_1.NewStatus.Draft;
            }
            news.updatedAt = new Date();
            news.updatedBy = currentUserId;
            yield news.save();
        });
    }
    bulkCreateNewsTags(tagIds, newsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsTags = [];
            for (const tagId of tagIds) {
                newsTags.push({
                    newsId,
                    tagId
                });
            }
            yield init_models_1.NewsTags.bulkCreate(newsTags, { returning: true });
        });
    }
    deleteNewsTags() {
        return __awaiter(this, void 0, void 0, function* () {
            yield init_models_1.NewsTags.update({
                isDeleted: true,
                updatedAt: new Date()
            }, {
                where: {
                    isDeleted: false
                }
            });
        });
    }
}
exports.AdminConsoleNewsService = AdminConsoleNewsService;
