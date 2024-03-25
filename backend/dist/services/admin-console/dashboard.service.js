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
exports.AdminConsoleDashboardService = void 0;
const sequelize_1 = require("sequelize");
const init_models_1 = require("../../models/init-models");
const histories_service_1 = require("./histories.service");
const sequelize_typescript_1 = require("sequelize-typescript");
class AdminConsoleDashboardService {
    getDashBoard() {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalNews, totalUsers, totalNewsActive, totalNewsInactive, getHistories, getMembers, getTop10OfNews] = yield Promise.all([
                init_models_1.News.count({
                    where: {
                        isDeleted: false
                    }
                }),
                init_models_1.Users.count({
                    where: {
                        isDeleted: false
                    }
                }),
                init_models_1.News.count({
                    where: {
                        isDeleted: false,
                        status: 'publish'
                    }
                }),
                init_models_1.News.count({
                    where: {
                        isDeleted: false,
                        status: 'draft'
                    }
                }),
                histories_service_1.listHistories(),
                init_models_1.Users.findAll({
                    attributes: [
                        'id', 'name'
                    ],
                    where: {
                        isDeleted: false,
                        roleId: {
                            [sequelize_1.Op.ne]: null
                        }
                    }
                }),
                init_models_1.News.findAll({
                    raw: true,
                    attributes: [
                        'id',
                        'title',
                        'status',
                        'slug',
                        ['is_hot_news', 'isHotNews'],
                        ['created_at', 'createdAt'],
                        ['created_by', 'createdBy'],
                        'view'
                    ],
                    where: {
                        isDeleted: false,
                        status: 'publish',
                        [sequelize_1.Op.and]: [{
                                view: {
                                    [sequelize_1.Op.ne]: null
                                }
                            },
                            sequelize_typescript_1.Sequelize.where(sequelize_typescript_1.Sequelize.cast(sequelize_typescript_1.Sequelize.col('view'), 'BIGINT'), {
                                [sequelize_1.Op.gte]: 5000
                            })
                        ]
                    },
                    order: [
                        [sequelize_typescript_1.Sequelize.cast(sequelize_typescript_1.Sequelize.col('view'), 'BIGINT'), 'DESC']
                    ],
                    limit: 10
                })
            ]);
            const totalCount = {
                totalNews,
                totalUsers,
                totalNewsActive,
                totalNewsInactive
            };
            const histories = getHistories.slice(0, 15);
            const top10OfNews = getTop10OfNews.map((news) => {
                var _a;
                const createdBy = ((_a = getMembers.find((member) => member.id === news.createdBy)) === null || _a === void 0 ? void 0 : _a.name) || '';
                return {
                    id: news.id,
                    title: news.title,
                    slug: news.slug,
                    isHotNews: news.isHotNews,
                    view: news.view,
                    createdDate: news.createdAt,
                    isPublish: news.status === 'publish',
                    createdBy
                };
            });
            const result = {
                totalCount,
                histories,
                top10OfNews
            };
            return {
                data: result
            };
        });
    }
}
exports.AdminConsoleDashboardService = AdminConsoleDashboardService;
