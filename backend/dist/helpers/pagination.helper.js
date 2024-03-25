"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaginationRequest = void 0;
const lodash_1 = require("lodash");
const app_constant_1 = require("../constants/app.constant");
function handlePaginationRequest(query) {
    const firstPage = 1;
    const page = query.page && query.page >= firstPage
        ? lodash_1.min([lodash_1.floor(query.page, firstPage)])
        : firstPage;
    const size = query.size && query.size >= 1
        ? lodash_1.min([lodash_1.floor(query.size), app_constant_1.PAGE_SIZE_MAX])
        : app_constant_1.PAGE_SIZE_MAX;
    return { page, size };
}
exports.handlePaginationRequest = handlePaginationRequest;
