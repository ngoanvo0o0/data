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
exports.AdminConsoleRoleService = void 0;
const init_models_1 = require("../../models/init-models");
class AdminConsoleRoleService {
    getSelectRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield init_models_1.Roles.findAll({
                where: {
                    isDeleted: false
                },
                order: [
                    ['name', 'ASC']
                ]
            });
            const rolesMapped = roles.map((role) => {
                return {
                    label: role.name,
                    value: role.id
                };
            });
            return { data: rolesMapped };
        });
    }
}
exports.AdminConsoleRoleService = AdminConsoleRoleService;
