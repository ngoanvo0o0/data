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
exports.FileService = exports.saveFile = exports.removeFile = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const app_constant_1 = require("../constants/app.constant");
function removeFile(path) {
    if (fs_1.existsSync(path)) {
        fs_1.unlinkSync(path);
    }
}
exports.removeFile = removeFile;
function saveFile(folderPath, fileName, data) {
    if (!fs_1.existsSync(folderPath)) {
        fs_1.mkdirSync(folderPath, { recursive: true });
    }
    fs_1.writeFileSync(path_1.join(folderPath, `/${fileName}`), data);
}
exports.saveFile = saveFile;
class FileService {
    getFileUrl(fileName, type) {
        switch (type) {
            case 'rao-vat':
                return path_1.join(app_constant_1.RAOVAT_IMAGE_FOLDER, fileName);
            case 'categories':
                return path_1.join(app_constant_1.CATEGORIES_IMAGE_FOLDER, fileName);
            case 'website-config':
                return path_1.join(app_constant_1.WEBSITE_CONFIG_IMAGE_FOLDER, fileName);
            default:
                return path_1.join(fileName);
        }
    }
    getDirectory(assetDir, type) {
        switch (type) {
            case 'rao-vat':
                return path_1.join(assetDir, app_constant_1.RAOVAT_IMAGE_FOLDER);
            case 'categories':
                return path_1.join(assetDir, app_constant_1.CATEGORIES_IMAGE_FOLDER);
            case 'website-config':
                return path_1.join(assetDir, app_constant_1.WEBSITE_CONFIG_IMAGE_FOLDER);
            default:
                return path_1.join(assetDir);
        }
    }
    getAllImageUrls(assetDir) {
        const fs = require('fs');
        const fileUrls = {
            categoriesImages: [],
            adImages: [],
            raoVatImages: []
        };
        const configIMageFolder = path_1.join(assetDir, app_constant_1.WEBSITE_CONFIG_IMAGE_FOLDER);
        const categoriesImageFolder = path_1.join(assetDir, app_constant_1.CATEGORIES_IMAGE_FOLDER);
        const adImageFolder = path_1.join(assetDir, app_constant_1.ADVERTISEMENT_IMAGE_FOLDER);
        const raoVatImageFolder = path_1.join(assetDir, app_constant_1.RAOVAT_IMAGE_FOLDER);
        // if (fs.existsSync(configIMageFolder)) {
        //   fs.readdirSync(configIMageFolder).forEach((file: any) => {
        //     fileUrls..push(`${configIMageFolder}/${file}`);
        //   });
        // }
        if (fs.existsSync(categoriesImageFolder)) {
            fs.readdirSync(categoriesImageFolder).forEach((file) => {
                fileUrls.categoriesImages.push({
                    url: `${categoriesImageFolder}/${file}`,
                    createdAt: fs.statSync(`${categoriesImageFolder}/${file}`).ctime
                });
            });
        }
        if (fs.existsSync(adImageFolder)) {
            fs.readdirSync(adImageFolder).forEach((file) => {
                fileUrls.categoriesImages.push({
                    url: `${adImageFolder}/${file}`,
                    createdAt: fs.statSync(`${adImageFolder}/${file}`).ctime
                });
            });
        }
        if (fs.existsSync(raoVatImageFolder)) {
            fs.readdirSync(raoVatImageFolder).forEach((file) => {
                fileUrls.categoriesImages.push({
                    url: `${raoVatImageFolder}/${file}`,
                    createdAt: fs.statSync(`${raoVatImageFolder}/${file}`).ctime
                });
            });
        }
        return fileUrls;
    }
    removeImages(images) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = require('fs');
            const assetDir = global.assetDir;
            images.map((link) => __awaiter(this, void 0, void 0, function* () {
                fs.unlinkSync(path_1.join(assetDir, link));
            }));
        });
    }
}
exports.FileService = FileService;
