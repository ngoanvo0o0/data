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
exports.WebsiteService = void 0;
const Comments_1 = require("../models/Comments");
const pagination_dto_1 = require("../dtos/pagination.dto");
const Users_1 = require("../models/Users");
const News_1 = require("../models/News");
const Categories_1 = require("../models/Categories");
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
const Menu_1 = require("../models/Menu");
const RaoVats_1 = require("../models/RaoVats");
const Ads_1 = require("../models/Ads");
const Website_1 = require("../models/Website");
const host = process.env.HOST || "";
class WebsiteService {
    createComment(commentRequest, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Comments_1.Comments.create({
                content: commentRequest.content,
                newsId: commentRequest.newsId,
                raoVatId: commentRequest.raoVatId,
                anonymousEmail: commentRequest.anonymousEmail,
                anonymousName: commentRequest.anonymousName,
                userId: currentUser
            });
        });
    }
    getComments(getCommentRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows, count } = yield Comments_1.Comments.findAndCountAll({
                where: {
                    isDeleted: false,
                    raoVatId: getCommentRequest.raoVatId || null,
                    newsId: getCommentRequest.newsId || null
                },
                offset: (getCommentRequest.page - 1) * getCommentRequest.size,
                limit: getCommentRequest.size,
                include: [
                    {
                        model: Users_1.Users,
                        as: 'user',
                        required: false,
                        where: {
                            isDeleted: false
                        }
                    }
                ],
                order: [['createdAt', 'asc']]
            });
            const comments = rows.map(e => {
                var _a, _b, _c, _d;
                return {
                    name: ((_a = e.user) === null || _a === void 0 ? void 0 : _a.name) || e.anonymousName,
                    email: ((_b = e.user) === null || _b === void 0 ? void 0 : _b.email) || e.anonymousEmail,
                    content: e.content,
                    avatar: (_c = e.user) === null || _c === void 0 ? void 0 : _c.avatar,
                    createdAt: e.createdAt,
                    userId: (_d = e.user) === null || _d === void 0 ? void 0 : _d.id
                };
            });
            return new pagination_dto_1.PagedList(comments, count, getCommentRequest.page, getCommentRequest.size);
        });
    }
    getNewsGroupedByCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const newsOnlyParentCategories = yield News_1.News.findAll({
                where: {
                    isDeleted: false,
                    status: 'publish',
                    isHotNews: false
                },
                include: [{
                        model: Categories_1.Categories,
                        as: 'category',
                        where: {
                            isDeleted: false,
                            status: 'active',
                            type: 'news',
                            parentId: null,
                        },
                    },
                    {
                        model: Users_1.Users,
                        as: 'user',
                        // where: {
                        //   isDeleted: false
                        // }
                    }],
                order: [['createdAt', 'desc']]
            });
            const newsOnlySubCategories = yield News_1.News.findAll({
                where: {
                    isDeleted: false,
                    status: 'publish',
                    isHotNews: false
                },
                include: [{
                        model: Categories_1.Categories,
                        as: 'category',
                        where: {
                            isDeleted: false,
                            status: 'active',
                            type: 'news'
                        },
                        include: [{
                                required: true,
                                model: Categories_1.Categories,
                                as: 'parent',
                                where: {
                                    type: 'news',
                                    isDeleted: false,
                                    status: 'active'
                                }
                            }]
                    },
                    {
                        model: Users_1.Users,
                        as: 'user',
                        // where: {
                        //   isDeleted: false
                        // }
                    }
                ],
                order: [['createdAt', 'desc']]
            });
            const news = [...newsOnlySubCategories, ...newsOnlyParentCategories];
            const newsGroupedByCategory = lodash_1.chain(news).map(e => {
                var _a, _b, _c, _d, _e, _f, _g;
                return {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    content: e.content,
                    publishDate: e.publishDate,
                    userId: e.userId,
                    categoryId: ((_a = e.category.parent) === null || _a === void 0 ? void 0 : _a.id) || ((_b = e.category) === null || _b === void 0 ? void 0 : _b.id),
                    categoryName: ((_c = e.category.parent) === null || _c === void 0 ? void 0 : _c.name) || ((_d = e.category) === null || _d === void 0 ? void 0 : _d.name),
                    categoryStyle: ((_e = e.category.parent) === null || _e === void 0 ? void 0 : _e.styleShow) || ((_f = e.category) === null || _f === void 0 ? void 0 : _f.styleShow),
                    imageUrl: e.imageurl && `${host}${e.imageurl}`,
                    status: e.status,
                    slug: e.slug,
                    isHotNews: e.isHotNews,
                    author: (_g = e.user) === null || _g === void 0 ? void 0 : _g.name,
                    view: e.view,
                    createdAt: e.createdAt
                };
            })
                .sortBy(e => e.createdAt)
                .reverse()
                .groupBy(e => (`${e.categoryId}@${e.categoryName}@${e.categoryStyle}`))
                .map((e, key) => {
                const id = key.split('\@')[0];
                const name = key.split('\@')[1];
                const categoryStyle = key.split('\@')[2];
                return {
                    id,
                    name,
                    styleShow: categoryStyle,
                    newses: e === null || e === void 0 ? void 0 : e.slice(0, 6)
                };
            })
                .value();
            return newsGroupedByCategory;
        });
    }
    getSitemap() {
        return __awaiter(this, void 0, void 0, function* () {
            const HOST = process.env.WEBSITE_URL;
            const [menus, newses, raoVats, categories] = yield Promise.all([
                Menu_1.Menu.findAll({
                    where: {
                        isDeleted: false,
                        slug: {
                            [sequelize_1.Op.ne]: null
                        }
                    }
                }),
                News_1.News.findAll({
                    where: {
                        isDeleted: false,
                        status: 'publish',
                        slug: {
                            [sequelize_1.Op.ne]: null
                        }
                    }
                }),
                RaoVats_1.RaoVats.findAll({
                    where: {
                        isDeleted: false,
                        slug: {
                            [sequelize_1.Op.ne]: null
                        }
                    }
                }),
                Categories_1.Categories.findAll({
                    where: {
                        isDeleted: false,
                        slug: {
                            [sequelize_1.Op.ne]: null
                        }
                    }
                })
            ]);
            const menuSlugs = [...menus].filter((menu) => menu.slug).map((menu) => `${HOST}/${menu.slug}`);
            const newsSlugs = [...newses].filter((news) => news.slug).map((news) => `${HOST}/bai-viet/${news.slug}`);
            const raoVatSlugs = [...raoVats].filter((raoVat) => raoVat.slug).map((raoVat) => `${HOST}/rao-vat/${raoVat.slug}`);
            const categorySlugs = [...categories].filter((category) => category.slug).map((category) => `${HOST}/${category.slug}`);
            return lodash_1.uniqBy([...menuSlugs, ...newsSlugs, ...raoVatSlugs, ...categorySlugs], (e) => e);
        });
    }
    getAds() {
        return __awaiter(this, void 0, void 0, function* () {
            const ads = yield Ads_1.Ads.findAll({
                where: {
                    isDeleted: false
                },
                order: [['order', 'asc']]
            });
            return ads.map(e => {
                return {
                    id: e.id,
                    name: e.name,
                    imageUrl: e.imageurl && `${host}${e.imageurl}`,
                    url: e.url,
                    order: e.order,
                    position: e.position
                };
            });
        });
    }
    getWebsiteConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const web = yield Website_1.Website.findOne();
            return {
                logo: web === null || web === void 0 ? void 0 : web.logo,
                facebookUrl: web === null || web === void 0 ? void 0 : web.facebookUrl,
                googleUrl: web === null || web === void 0 ? void 0 : web.googleUrl,
                twitterUrl: web === null || web === void 0 ? void 0 : web.twitterUrl,
                linkedinUrl: web === null || web === void 0 ? void 0 : web.linkedinUrl
            };
        });
    }
}
exports.WebsiteService = WebsiteService;
