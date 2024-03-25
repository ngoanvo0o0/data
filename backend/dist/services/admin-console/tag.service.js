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
exports.AdminConsoleTagsService = void 0;
const init_models_1 = require("../../models/init-models");
const lodash_1 = require("lodash");
class AdminConsoleTagsService {
    getSelectTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield init_models_1.Tags.findAll({
                where: {
                    isDeleted: false
                },
                order: [
                    ['name', 'ASC']
                ]
            });
            const tagsMapped = tags.map((category) => {
                return {
                    label: category.name,
                    value: category.id
                };
            });
            return { data: tagsMapped };
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield init_models_1.Tags.findAll({
                where: {
                    isDeleted: false
                }
            });
            const tagsMapped = tags.map((tag) => {
                return {
                    name: tag.name,
                    count: lodash_1.random(1, 30)
                };
            });
            return { data: tagsMapped };
        });
    }
}
exports.AdminConsoleTagsService = AdminConsoleTagsService;
