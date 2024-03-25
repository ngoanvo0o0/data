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
exports.AdminConsoleReport = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../sequelize");
class AdminConsoleReport {
    getTotalNewsOfMonth() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT count(*) total_news,
        to_char(n.created_at, 'YYYY-MM') "month"
    FROM news n
    GROUP BY to_char(n.created_at, 'YYYY-MM')
    ORDER BY to_char(n.created_at, 'YYYY-MM') DESC`;
            const resultOfQuery = yield ((_b = (_a = sequelize_2.ConfigSequelize.getInstance()) === null || _a === void 0 ? void 0 : _a.sequelize) === null || _b === void 0 ? void 0 : _b.query(query, { type: sequelize_1.QueryTypes.SELECT }));
            const result = resultOfQuery.map((item) => {
                return {
                    totalNews: Number(item.total_news),
                    month: item.month
                };
            });
            return { data: result };
        });
    }
    getNewsOfMembers() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT to_char(n.created_at, 'YYYY-MM') "month",
        u."name",
        u.id user_id,
        count(n.id) total_news,
        sum(n."view"::integer) total_views
    FROM news n
    LEFT JOIN users u ON u.id = n.created_by
    WHERE n.is_deleted = FALSE
    GROUP BY "month",
          u.id
    ORDER BY "month" DESC`;
            const resultOfQuery = yield ((_b = (_a = sequelize_2.ConfigSequelize.getInstance()) === null || _a === void 0 ? void 0 : _a.sequelize) === null || _b === void 0 ? void 0 : _b.query(query, { type: sequelize_1.QueryTypes.SELECT }));
            const result = resultOfQuery.map((item) => {
                return {
                    month: item.month,
                    userId: item.user_id,
                    name: item.name,
                    totalNews: Number(item.total_news || 0),
                    totalViews: Number(item.total_views || 0)
                };
            });
            return { data: result };
        });
    }
    getNewsDetailsOfMembers(userId, month) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT n.title,
        n."view",
        n.slug
    FROM news n
    WHERE n.is_deleted = FALSE
    AND n.created_by = :userId
    AND to_char(n.created_at, 'YYYY-MM') = :month`;
            const resultOfQuery = yield ((_b = (_a = sequelize_2.ConfigSequelize.getInstance()) === null || _a === void 0 ? void 0 : _a.sequelize) === null || _b === void 0 ? void 0 : _b.query(query, { type: sequelize_1.QueryTypes.SELECT, replacements: {
                    userId,
                    month
                } }));
            const result = resultOfQuery.map((item) => {
                return {
                    title: item.title,
                    slug: item.slug,
                    view: Number(item.view || 0)
                };
            });
            return { data: result };
        });
    }
}
exports.AdminConsoleReport = AdminConsoleReport;
