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
exports.WebsiteApi = void 0;
const news_service_1 = require("../../services/admin-console/news.service");
const tsoa_1 = require("tsoa");
const raovat_service_1 = require("../../services/admin-console/raovat.service");
const tag_service_1 = require("../../services/admin-console/tag.service");
const website_service_1 = require("../../services/website.service");
let WebsiteApi = 
// @Security('')
class WebsiteApi extends tsoa_1.Controller {
    getNews(newsesRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return new news_service_1.AdminConsoleNewsService().getNewsForWebsite(newsesRequest);
        });
    }
    getRaoVats(raoVatRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return new raovat_service_1.AdminConsoleRaoVatService().getRaoVatsForWebsite(raoVatRequest);
        });
    }
    getRaoVatBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return new raovat_service_1.AdminConsoleRaoVatService().getRaoVatBySlug(slug);
        });
    }
    getCategoriesByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return new raovat_service_1.AdminConsoleRaoVatService().getCategoriesByType(type);
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return new tag_service_1.AdminConsoleTagsService().getTags();
        });
    }
    addComment(commentRequest, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = (_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId;
            return new website_service_1.WebsiteService().createComment(commentRequest, currentUser);
        });
    }
    getComments(getCommentRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return new website_service_1.WebsiteService().getComments(getCommentRequest);
        });
    }
    getNewsGroupedByCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return new website_service_1.WebsiteService().getNewsGroupedByCategory();
        });
    }
    getSitemap() {
        return __awaiter(this, void 0, void 0, function* () {
            return new website_service_1.WebsiteService().getSitemap();
        });
    }
    getAds() {
        return __awaiter(this, void 0, void 0, function* () {
            return new website_service_1.WebsiteService().getAds();
        });
    }
    getLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            return new website_service_1.WebsiteService().getWebsiteConfig();
        });
    }
};
__decorate([
    tsoa_1.Get("news"),
    __param(0, tsoa_1.Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getNews", null);
__decorate([
    tsoa_1.Get("rao-vat"),
    __param(0, tsoa_1.Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getRaoVats", null);
__decorate([
    tsoa_1.Get("rao-vat/{slug}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getRaoVatBySlug", null);
__decorate([
    tsoa_1.Get("categories"),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getCategoriesByType", null);
__decorate([
    tsoa_1.Get("tags"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getTags", null);
__decorate([
    tsoa_1.Post("comments"),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "addComment", null);
__decorate([
    tsoa_1.Get("comments"),
    __param(0, tsoa_1.Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getComments", null);
__decorate([
    tsoa_1.Get("news/grouped-by-category"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getNewsGroupedByCategory", null);
__decorate([
    tsoa_1.Get("sitemap"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getSitemap", null);
__decorate([
    tsoa_1.Get("ads"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getAds", null);
__decorate([
    tsoa_1.Get("config"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebsiteApi.prototype, "getLinks", null);
WebsiteApi = __decorate([
    tsoa_1.Route(''),
    tsoa_1.Tags('website')
    // @Security('')
], WebsiteApi);
exports.WebsiteApi = WebsiteApi;
