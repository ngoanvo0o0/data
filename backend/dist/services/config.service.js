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
exports.updateFooter = exports.updateIcon = exports.updateLogo = void 0;
const path_1 = require("path");
const config_constant_1 = require("../constants/config.constant");
const Configs_1 = require("../models/Configs");
const file_service_1 = require("./file.service");
const uuidv4_1 = require("uuidv4");
const host = process.env.HOST || "";
function updateLogo(extension, buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield updateImageConfig(config_constant_1.LOGO_CONFIG, `/${path_1.join(config_constant_1.LOGO_NAME, extension)}`, buffer);
    });
}
exports.updateLogo = updateLogo;
function updateIcon(extension, buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield updateImageConfig(config_constant_1.ICON_CONFIG, `${path_1.join(config_constant_1.ICON_CONFIG, extension)}`, buffer);
    });
}
exports.updateIcon = updateIcon;
function updateImageConfig(key, fullImageName, buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const assetDir = global.assetDir;
        const config = yield Configs_1.Configs.findOne({
            where: {
                key: key,
            },
        });
        if (config === null || config === void 0 ? void 0 : config.value) {
            file_service_1.removeFile(path_1.join(assetDir, config.value));
        }
        file_service_1.removeFile(path_1.join(assetDir, fullImageName));
        file_service_1.saveFile(assetDir, fullImageName, buffer);
        Configs_1.Configs.upsert({
            id: (config === null || config === void 0 ? void 0 : config.id) || uuidv4_1.uuid(),
            key: config_constant_1.LOGO_CONFIG,
            value: fullImageName,
            updatedAt: new Date(),
        });
        return path_1.join(host, fullImageName);
    });
}
function updateFooter(content) {
    return __awaiter(this, void 0, void 0, function* () {
        const footerContent = yield Configs_1.Configs.findOne({
            where: {
                key: config_constant_1.FOOTER_CONTENT_CONFIG,
            },
        });
        Configs_1.Configs.upsert({
            id: (footerContent === null || footerContent === void 0 ? void 0 : footerContent.id) || uuidv4_1.uuid(),
            key: config_constant_1.LOGO_CONFIG,
            value: content || "",
            updatedAt: new Date(),
        });
    });
}
exports.updateFooter = updateFooter;
