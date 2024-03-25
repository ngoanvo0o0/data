"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_facebook_1 = require("passport-facebook");
function configPassport() {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
    const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "";
    passport_1.default.use("google", new passport_google_oauth2_1.Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
    }, function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));
    const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || "";
    const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET || "";
    const FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL || "";
    passport_1.default.use("facebook", new passport_facebook_1.Strategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "email"],
    }, function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));
}
exports.configPassport = configPassport;
