"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_http_1 = __importDefault(require("serverless-http"));
require("./env"); // Must be the first import
const Server_1 = __importDefault(require("./Server"));
const Logger_1 = __importDefault(require("./shared/Logger"));
// Start the server
const port = Number(process.env.PORT || 3000);
Server_1.default.listen(port, () => {
    Logger_1.default.info("Express server started on port: " + port);
});
module.exports.handler = serverless_http_1.default(Server_1.default);
