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
exports.UploadController = void 0;
const crypto_1 = require("crypto");
const path_1 = require("path");
const tsoa_1 = require("tsoa");
const file_service_1 = require("../../services/file.service");
let UploadController = class UploadController extends tsoa_1.Controller {
    uploadFile(image, type, oldUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = crypto_1.randomUUID() + path_1.extname(image.originalname);
            const url = new file_service_1.FileService().getFileUrl(fileName, type);
            const assetDir = global.assetDir;
            const raoVatDir = new file_service_1.FileService().getDirectory(assetDir, type);
            file_service_1.saveFile(raoVatDir, fileName, image.buffer);
            if (oldUrl) {
                const oldImagePath = path_1.join(assetDir, oldUrl);
                file_service_1.removeFile(oldImagePath);
            }
            return decodeURI(url);
        });
    }
    uploadFiles(type, images) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlList = [];
            images.forEach(x => urlList.push(this.saveFileFromRequest(x, type)));
            return urlList.map(x => decodeURI(x));
        });
    }
    saveFileFromRequest(image, type) {
        const fileName = crypto_1.randomUUID() + path_1.extname(image.originalname);
        const url = new file_service_1.FileService().getFileUrl(fileName, type);
        const assetDir = global.assetDir;
        const raoVatDir = new file_service_1.FileService().getDirectory(assetDir, type);
        file_service_1.saveFile(raoVatDir, fileName, image.buffer);
        return url;
    }
};
__decorate([
    tsoa_1.Post(),
    __param(0, tsoa_1.UploadedFile('image')),
    __param(1, tsoa_1.FormField()),
    __param(2, tsoa_1.FormField()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
__decorate([
    tsoa_1.Post("{type}"),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.UploadedFiles('images')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFiles", null);
UploadController = __decorate([
    tsoa_1.Route('upload'),
    tsoa_1.Tags('upload'),
    tsoa_1.Security("")
], UploadController);
exports.UploadController = UploadController;
