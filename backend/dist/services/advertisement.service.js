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
exports.deleteAdvertisement = exports.updateAdvertisement = exports.createAdvertisement = exports.getAdvertisement = exports.getAdvertisements = void 0;
const Ads_1 = require("../models/Ads");
const pagination_helper_1 = require("../helpers/pagination.helper");
const type_value_helper_1 = require("../helpers/type-value.helper");
const Users_1 = require("../models/Users");
const errorHandler_1 = require("../errorHandler");
const histories_service_1 = require("./admin-console/histories.service");
const history_dto_1 = require("../dtos/history.dto");
const host = process.env.HOST || "";
function getAdvertisements(pagination) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedPagination = pagination_helper_1.handlePaginationRequest(pagination);
        const ads = yield Ads_1.Ads.findAll({
            limit: validatedPagination.size,
            offset: (validatedPagination.page - 1) * validatedPagination.size,
            where: { isDeleted: false },
            order: [["updatedAt", "DESC"]],
        });
        return ads.map((ad) => mapEntityToDto(ad));
    });
}
exports.getAdvertisements = getAdvertisements;
function getAdvertisement(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const ad = yield Ads_1.Ads.findByPk(id);
        if (!ad) {
            throw new errorHandler_1.CustomError("Advertisement not found", 404);
        }
        const userUpdated = yield Users_1.Users.findOne({
            where: {
                isDeleted: false,
                id: ad.updatedBy,
            },
        });
        return mapEntityToDto(ad, userUpdated === null || userUpdated === void 0 ? void 0 : userUpdated.name);
    });
}
exports.getAdvertisement = getAdvertisement;
function createAdvertisement(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!input.imageUrl) {
            throw new errorHandler_1.CustomError("Missing image", 404);
        }
        checkAdvertisementInputValues(input);
        yield checkUserExistence(input.userId);
        const ad = yield Ads_1.Ads.create({
            name: input.name,
            imageurl: input.imageUrl,
            order: input.order,
            position: input.position,
            status: input.status,
            createdBy: input.userId,
            updatedBy: input.userId,
            url: input.url,
        });
        histories_service_1.logCreation(input.userId, ad.id, ad.name, history_dto_1.HistoryEntityType.Advertisement);
        return mapEntityToDto(ad);
    });
}
exports.createAdvertisement = createAdvertisement;
function updateAdvertisement(id, input) {
    return __awaiter(this, void 0, void 0, function* () {
        checkAdvertisementInputValues(input);
        const advertisement = yield Ads_1.Ads.findByPk(id);
        if (!advertisement) {
            throw new errorHandler_1.CustomError("Advertisement not found", 404);
        }
        if (advertisement.updatedBy !== input.userId) {
            checkUserExistence(input.userId);
            advertisement.updatedBy = input.userId;
        }
        const oldImageUrl = advertisement.imageurl;
        advertisement.name = input.name;
        advertisement.order = input.order;
        advertisement.url = input.url;
        advertisement.position = input.position;
        advertisement.status = input.status;
        advertisement.updatedAt = new Date();
        if (input.imageUrl) {
            advertisement.imageurl = input.imageUrl;
        }
        yield advertisement.save();
        histories_service_1.logUpdate(input.userId, advertisement.id, advertisement.name, history_dto_1.HistoryEntityType.Advertisement);
        return { advertisement: mapEntityToDto(advertisement), oldImageUrl };
    });
}
exports.updateAdvertisement = updateAdvertisement;
function deleteAdvertisement(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const advertisement = yield Ads_1.Ads.findByPk(id);
        if (!advertisement) {
            throw new errorHandler_1.CustomError("Advertisement not found", 404);
        }
        advertisement.isDeleted = true;
        advertisement.updatedBy = userId;
        advertisement.updatedAt = new Date();
        yield advertisement.save();
        histories_service_1.logDeletion(userId, advertisement.id, advertisement.name, history_dto_1.HistoryEntityType.Advertisement);
    });
}
exports.deleteAdvertisement = deleteAdvertisement;
function checkAdvertisementInputValues(input) {
    if (!input.name ||
        !input.order ||
        !input.url ||
        !input.position ||
        !input.status ||
        !input.userId) {
        throw new errorHandler_1.CustomError("Missing required fields", 404);
    }
    if (!type_value_helper_1.isBelongToValues(input.position, [
        "top",
        "left",
        "right",
        "center",
        "bottom",
    ])) {
        throw new errorHandler_1.CustomError("Invalid position value", 404);
    }
    if (!type_value_helper_1.isBelongToValues(input.status, ["active", "inactive"])) {
        throw new errorHandler_1.CustomError("Invalid status value", 404);
    }
    if (input.order < 1) {
        throw new errorHandler_1.CustomError("Invalid order value", 404);
    }
}
function checkUserExistence(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users_1.Users.findByPk(userId);
        if (!user) {
            throw new errorHandler_1.CustomError("User not found", 404);
        }
    });
}
function mapEntityToDto(entity, userNameUpdated) {
    return {
        id: entity.id,
        name: entity.name,
        url: entity.url,
        imageUrl: entity.imageurl && `${host}${entity.imageurl}`,
        order: entity.order,
        position: entity.position,
        status: entity.status,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        userNameUpdated,
    };
}
