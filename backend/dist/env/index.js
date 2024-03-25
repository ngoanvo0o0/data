"use strict";
/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_args_1 = __importDefault(require("command-line-args"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
(() => {
    // Setup command line options
    const options = command_line_args_1.default([
        {
            name: 'env',
            alias: 'e',
            defaultValue: 'production',
            type: String,
        },
    ], { partial: true });
    // Set the env file
    const result2 = dotenv_1.default.config({
        path: path_1.default.join(__dirname, `${options.env}.env`),
    });
    if (result2.error) {
        throw result2.error;
    }
})();
