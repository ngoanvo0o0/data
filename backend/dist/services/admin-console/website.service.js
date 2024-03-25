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
exports.AdminConsoleWebsiteService = void 0;
const init_models_1 = require("../../models/init-models");
const histories_service_1 = require("./histories.service");
const history_dto_1 = require("../../dtos/history.dto");
const host = process.env.HOST || "";
class AdminConsoleWebsiteService {
    getWebsite() {
        return __awaiter(this, void 0, void 0, function* () {
            const websiteModel = yield init_models_1.Website.findOne({
                where: {
                    isDeleted: false
                },
                order: [
                    ['created_at', 'asc']
                ],
                limit: 1
            });
            const result = {
                id: websiteModel === null || websiteModel === void 0 ? void 0 : websiteModel.id,
                logo: websiteModel === null || websiteModel === void 0 ? void 0 : websiteModel.logo,
                footerContent: websiteModel === null || websiteModel === void 0 ? void 0 : websiteModel.footerContent,
                facebookUrl: websiteModel === null || websiteModel === void 0 ? void 0 : websiteModel.facebookUrl,
                twitterUrl: websiteModel === null || websiteModel === void 0 ? void 0 : websiteModel.twitterUrl,
                googleUrl: websiteModel === null || websiteModel === void 0 ? void 0 : websiteModel.googleUrl,
                linkedinUrl: websiteModel === null || websiteModel === void 0 ? void 0 : websiteModel.linkedinUrl
            };
            return { data: result };
        });
    }
    upsertWebsite(websiteRequest, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const [website] = yield init_models_1.Website.upsert({
                id: websiteRequest.id,
                logo: websiteRequest.logo && `${host}${websiteRequest.logo}`,
                footerContent: websiteRequest.footerContent,
                facebookUrl: websiteRequest.facebookUrl,
                googleUrl: websiteRequest.googleUrl,
                linkedinUrl: websiteRequest.linkedinUrl,
                twitterUrl: websiteRequest.twitterUrl,
                createdBy: !websiteRequest.id ? currentUser : undefined,
                updatedBy: currentUser,
                updatedAt: new Date()
            }, {
                returning: true
            });
            histories_service_1.logHistory(currentUser, "update", undefined, undefined, history_dto_1.HistoryEntityType.WebsiteContent);
            return {
                data: {
                    id: website.id,
                    facebookUrl: website.facebookUrl,
                    googleUrl: website.googleUrl,
                    linkedinUrl: website.linkedinUrl,
                    twitterUrl: website.twitterUrl,
                    footerContent: website.footerContent,
                    logo: website.logo
                }
            };
        });
    }
}
exports.AdminConsoleWebsiteService = AdminConsoleWebsiteService;
