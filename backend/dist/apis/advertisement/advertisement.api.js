"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.AdvertisementController = void 0;
const pagination_dto_1 = require("../../dtos/pagination.dto");
const AdvertisementService = __importStar(require("../../services/advertisement.service"));
const tsoa_1 = require("tsoa");
const crypto_1 = require("crypto");
const path_1 = require("path");
const file_service_1 = require("../../services/file.service");
const app_constant_1 = require("../../constants/app.constant");
let AdvertisementController = class AdvertisementController {
    getAdvertisements(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AdvertisementService.getAdvertisements(pagination);
        });
    }
    getAdvertisement(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AdvertisementService.getAdvertisement(id);
        });
    }
    createAdvertisement(request, image) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const input = request.body;
            const userId = ((_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId) || "";
            const fileName = crypto_1.randomUUID() + path_1.extname(image.originalname);
            input.userId = userId;
            input.imageUrl = path_1.join(app_constant_1.ADVERTISEMENT_IMAGE_FOLDER, fileName);
            const advertisement = yield AdvertisementService.createAdvertisement(input);
            const assetDir = global.assetDir;
            const advertisementDir = path_1.join(assetDir, app_constant_1.ADVERTISEMENT_IMAGE_FOLDER);
            file_service_1.saveFile(advertisementDir, fileName, image.buffer);
            return advertisement;
        });
    }
    updateAdvertisement(id, request, image) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const input = request.body;
            const userId = ((_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId) || "";
            input.userId = userId;
            const hasImage = !!image;
            let fileName = "";
            if (hasImage) {
                fileName = crypto_1.randomUUID() + path_1.extname(image.originalname);
                input.imageUrl = path_1.join(app_constant_1.ADVERTISEMENT_IMAGE_FOLDER, fileName);
            }
            else {
                delete input.imageUrl;
            }
            const { advertisement, oldImageUrl } = yield AdvertisementService.updateAdvertisement(id, input);
            if (hasImage) {
                const assetDir = global.assetDir;
                const advertisementDir = path_1.join(assetDir, app_constant_1.ADVERTISEMENT_IMAGE_FOLDER);
                file_service_1.saveFile(advertisementDir, fileName, image.buffer);
                if (oldImageUrl) {
                    const oldImagePath = path_1.join(assetDir, oldImageUrl);
                    yield file_service_1.removeFile(oldImagePath);
                }
            }
            return advertisement;
        });
    }
    deleteAdvertisement(id, request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ((_a = request.authInfo) === null || _a === void 0 ? void 0 : _a.userId) || "";
            yield AdvertisementService.deleteAdvertisement(id, userId);
        });
    }
};
__decorate([
    tsoa_1.Get(),
    __param(0, tsoa_1.Queries()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], AdvertisementController.prototype, "getAdvertisements", null);
__decorate([
    tsoa_1.Get("{id}"),
    __param(0, tsoa_1.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdvertisementController.prototype, "getAdvertisement", null);
__decorate([
    tsoa_1.Post(),
    tsoa_1.Security(""),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.UploadedFile("image")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdvertisementController.prototype, "createAdvertisement", null);
__decorate([
    tsoa_1.Put("{id}"),
    tsoa_1.Security(""),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __param(2, tsoa_1.UploadedFile("image")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdvertisementController.prototype, "updateAdvertisement", null);
__decorate([
    tsoa_1.Delete("{id}"),
    tsoa_1.Security(""),
    __param(0, tsoa_1.Path()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdvertisementController.prototype, "deleteAdvertisement", null);
AdvertisementController = __decorate([
    tsoa_1.Route("advertisements")
], AdvertisementController);
exports.AdvertisementController = AdvertisementController;
