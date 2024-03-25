"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AdminConsoleController = void 0;
const role_service_1 = require("../../services/admin-console/role.service");
const user_service_1 = require("../../services/admin-console/user.service");
const categories_service_1 = require("../../services/admin-console/categories.service");
const news_service_1 = require("../../services/admin-console/news.service");
const tsoa_1 = require("tsoa");
const raovat_service_1 = require("../../services/admin-console/raovat.service");
const tag_service_1 = require("../../services/admin-console/tag.service");
const pagination_dto_1 = require("../../dtos/pagination.dto");
const menu_service_1 = require("../../services/admin-console/menu.service");
const team_service_1 = require("../../services/admin-console/team.service");
const config_service_1 = require("../../services/admin-console/config.service");
const website_service_1 = require("../../services/admin-console/website.service");
const histories_service_1 = require("../../services/admin-console/histories.service");
const history_dto_1 = require("../../dtos/history.dto");
const dashboard_service_1 = require("../../services/admin-console/dashboard.service");
const reports_service_1 = require("../../services/admin-console/reports.service");
const file_service_1 = require("../../services/file.service");
let AdminConsoleController = class AdminConsoleController extends tsoa_1.Controller {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return new user_service_1.AdminConsoleUSerService().getUsers();
        });
    }
    getUsersById(userId, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new user_service_1.AdminConsoleUSerService().getUsersById(userId);
            const currentUser = (_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId;
            if (currentUser) {
                const data = result.data;
                histories_service_1.logVisit(currentUser, data.id, data.name, history_dto_1.HistoryEntityType.User);
            }
            return result;
        });
    }
    upsertUser(userRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new user_service_1.AdminConsoleUSerService().upsertUser(userRequest, currentUser);
        });
    }
    deleteUser(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new user_service_1.AdminConsoleUSerService().deleteUser(userId, currentUser);
        });
    }
    getTeam() {
        return __awaiter(this, void 0, void 0, function* () {
            return new team_service_1.AdminConsoleTeamService().getTeam();
        });
    }
    getTeamById(userId, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new team_service_1.AdminConsoleTeamService().getTeamById(userId);
            const currentUser = (_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId;
            if (currentUser) {
                const data = result.data;
                histories_service_1.logVisit(currentUser, data.id, data.name, history_dto_1.HistoryEntityType.Team);
            }
            return result;
        });
    }
    upsertTeam(userRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new team_service_1.AdminConsoleTeamService().upsertTeam(userRequest, currentUser);
        });
    }
    deleteTeam(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new team_service_1.AdminConsoleTeamService().deleteTeam(userId);
        });
    }
    getSelectRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return new role_service_1.AdminConsoleRoleService().getSelectRoles();
        });
    }
    getSelectCategories(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new categories_service_1.AdminConsoleCategoryService().getSelectCategories(type);
        });
    }
    getCategoriesParenst() {
        return __awaiter(this, void 0, void 0, function* () {
            return new categories_service_1.AdminConsoleCategoryService().getCategories();
        });
    }
    getCategories(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            return new categories_service_1.AdminConsoleCategoryService().getCategories(queries);
        });
    }
    getCategoriesById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new categories_service_1.AdminConsoleCategoryService().getCategorysById(categoryId);
        });
    }
    upsertCategory(userRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new categories_service_1.AdminConsoleCategoryService().upsertCategory(userRequest, currentUser);
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new categories_service_1.AdminConsoleCategoryService().deleteCategory(categoryId);
        });
    }
    getNews(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return new news_service_1.AdminConsoleNewsService().getNews(pagination);
        });
    }
    getNewsBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return new news_service_1.AdminConsoleNewsService().getNewsBySlug(slug);
        });
    }
    upsertNews(newsRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new news_service_1.AdminConsoleNewsService().upsertNews(newsRequest, currentUser);
        });
    }
    deleteNews(newsId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new news_service_1.AdminConsoleNewsService().deleteNews(newsId, currentUser);
        });
    }
    changeStatusNews(newsId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new news_service_1.AdminConsoleNewsService().changeStatusNews(newsId, currentUser);
        });
    }
    getRaoVats() {
        return __awaiter(this, void 0, void 0, function* () {
            return new raovat_service_1.AdminConsoleRaoVatService().getRaoVats();
        });
    }
    getRaoVatsById(raoVatId, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new raovat_service_1.AdminConsoleRaoVatService().getRaoVatsById(raoVatId);
            const currentUser = (_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId;
            if (currentUser) {
                const data = result.data;
                histories_service_1.logVisit(currentUser, data.id, data.title, history_dto_1.HistoryEntityType.RaoVat);
            }
            return result;
        });
    }
    upsertRaoVat(raoVatRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new raovat_service_1.AdminConsoleRaoVatService().upsertRaoVat(raoVatRequest, currentUser);
        });
    }
    deleteRaoVat(raoVatId, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = (_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId;
            return new raovat_service_1.AdminConsoleRaoVatService().deleteRaoVat(raoVatId, currentUser);
        });
    }
    getSelectTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return new tag_service_1.AdminConsoleTagsService().getSelectTags();
        });
    }
    getMenus() {
        return __awaiter(this, void 0, void 0, function* () {
            return new menu_service_1.AdminConsoleMenuService().getMenus();
        });
    }
    getMenusById(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new menu_service_1.AdminConsoleMenuService().getMenusById(menuId);
        });
    }
    upsertMenu(menuRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new menu_service_1.AdminConsoleMenuService().upsertMenu(menuRequest, currentUser);
        });
    }
    deleteMenu(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new menu_service_1.AdminConsoleMenuService().deleteMenu(menuId);
        });
    }
    getConfigByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new config_service_1.AdminConsoleConfigService().getConfigByKey(key);
        });
    }
    upsertConfig(configRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new config_service_1.AdminConsoleConfigService().upsertConfig(configRequest, currentUser);
        });
    }
    getWebsite() {
        return __awaiter(this, void 0, void 0, function* () {
            return new website_service_1.AdminConsoleWebsiteService().getWebsite();
        });
    }
    upsertWebsite(websiteRequest, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = request.authInfo.userId;
            return new website_service_1.AdminConsoleWebsiteService().upsertWebsite(websiteRequest, currentUser);
        });
    }
    getHistories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield histories_service_1.listHistories();
        });
    }
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new dashboard_service_1.AdminConsoleDashboardService().getDashBoard();
        });
    }
    getTotalNewsOfMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new reports_service_1.AdminConsoleReport().getTotalNewsOfMonth();
        });
    }
    getNewsOfMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new reports_service_1.AdminConsoleReport().getNewsOfMembers();
        });
    }
    getNewsDetailsOfMembers(userId, month) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new reports_service_1.AdminConsoleReport().getNewsDetailsOfMembers(userId, month);
        });
    }
    getAllImageUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const assetDir = global.assetDir;
            return new file_service_1.FileService().getAllImageUrls(assetDir);
        });
    }
    removeImages(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new file_service_1.FileService().removeImages(queries.images);
        });
    }
};
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Get("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getUsers", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Get("users/{userId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getUsersById", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("users"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertUser", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Delete("users/{userId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "deleteUser", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Get("team"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getTeam", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Get("team/{userId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getTeamById", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("team"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertTeam", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Delete("team/{userId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "deleteTeam", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Get("select/roles"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getSelectRoles", null);
__decorate([
    tsoa_1.Get("select/categories/{type}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getSelectCategories", null);
__decorate([
    tsoa_1.Get("categories/parents"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getCategoriesParenst", null);
__decorate([
    tsoa_1.Get("categories"),
    __param(0, tsoa_1.Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getCategories", null);
__decorate([
    tsoa_1.Get("categories/{categoryId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getCategoriesById", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("categories"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertCategory", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Delete("categories/{categoryId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "deleteCategory", null);
__decorate([
    tsoa_1.Get("news"),
    __param(0, tsoa_1.Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getNews", null);
__decorate([
    tsoa_1.Get("news/{slug}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getNewsBySlug", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("news"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertNews", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Delete("news/{newsId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "deleteNews", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Put("news/{newsId}/change-status"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "changeStatusNews", null);
__decorate([
    tsoa_1.Get("rao-vat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getRaoVats", null);
__decorate([
    tsoa_1.Get("rao-vat/{raoVatId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getRaoVatsById", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("rao-vat"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertRaoVat", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Delete("rao-vat/{raoVatId}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "deleteRaoVat", null);
__decorate([
    tsoa_1.Get("select/tags"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getSelectTags", null);
__decorate([
    tsoa_1.Get("menus"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getMenus", null);
__decorate([
    tsoa_1.Get("menus/{menuId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getMenusById", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("menus"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertMenu", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Delete("menus/{menuId}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "deleteMenu", null);
__decorate([
    tsoa_1.Get("configs/{key}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getConfigByKey", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("configs"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertConfig", null);
__decorate([
    tsoa_1.Get("website"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getWebsite", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Post("website"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "upsertWebsite", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Get("histories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getHistories", null);
__decorate([
    tsoa_1.Get('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getDashboard", null);
__decorate([
    tsoa_1.Get('reports/total-news-of-month'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getTotalNewsOfMonth", null);
__decorate([
    tsoa_1.Get('reports/news-of-members'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getNewsOfMembers", null);
__decorate([
    tsoa_1.Get('reports/news-details-by/{userId}/months/{month}'),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getNewsDetailsOfMembers", null);
__decorate([
    tsoa_1.Get('image-urls'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "getAllImageUrl", null);
__decorate([
    tsoa_1.Security(""),
    tsoa_1.Delete('remove-images'),
    __param(0, tsoa_1.Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminConsoleController.prototype, "removeImages", null);
AdminConsoleController = __decorate([
    tsoa_1.Route("admin-console"),
    tsoa_1.Tags("AdminConsole")
], AdminConsoleController);
exports.AdminConsoleController = AdminConsoleController;
