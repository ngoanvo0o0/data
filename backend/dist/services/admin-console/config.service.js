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
exports.AdminConsoleConfigService = void 0;
const Configs_1 = require("../../models/Configs");
const histories_service_1 = require("./histories.service");
const history_dto_1 = require("../../dtos/history.dto");
class AdminConsoleConfigService {
    getConfigByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const configModel = yield Configs_1.Configs.findOne({
                where: {
                    isDeleted: false,
                    key
                }
            });
            return {
                data: {
                    id: configModel === null || configModel === void 0 ? void 0 : configModel.id,
                    value: configModel === null || configModel === void 0 ? void 0 : configModel.value,
                    key: configModel === null || configModel === void 0 ? void 0 : configModel.key
                }
            };
        });
    }
    upsertConfig(configRequest, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const [config] = yield Configs_1.Configs.upsert({
                id: configRequest.id,
                key: configRequest.key,
                value: configRequest.value,
                type: configRequest.type,
                createdBy: !configRequest.id ? currentUser : undefined,
                updatedBy: currentUser,
                updatedAt: new Date()
            }, {
                returning: true
            });
            histories_service_1.logHistory(currentUser, 'update', undefined, undefined, history_dto_1.HistoryEntityType.Configuration);
            return {
                data: {
                    id: config.id,
                    value: config.value
                }
            };
        });
    }
}
exports.AdminConsoleConfigService = AdminConsoleConfigService;
