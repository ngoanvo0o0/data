"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagedList = exports.PaginationQuery = exports.NewStatus = void 0;
const app_constant_1 = require("../constants/app.constant");
var NewStatus;
(function (NewStatus) {
    NewStatus["Draft"] = "draft";
    NewStatus["Publish"] = "publish";
})(NewStatus = exports.NewStatus || (exports.NewStatus = {}));
class PaginationQuery {
    constructor() {
        this.page = 1;
        this.size = app_constant_1.PAGE_SIZE_MAX;
        // order: string;
    }
}
exports.PaginationQuery = PaginationQuery;
class PagedList {
    constructor(items, totalCount, page, size) {
        this.items = items;
        this.totalCount = totalCount;
        this.page = page;
        this.size = size;
        this.totalPage = Math.ceil(totalCount / size);
        this.hasPrevious = page > 1;
        this.hasNext = page < this.totalPage;
    }
}
exports.PagedList = PagedList;
