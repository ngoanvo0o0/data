"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("./sequelize");
const routes_1 = require("./routes");
const errorHandler_1 = require("./errorHandler");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const authentication_route_1 = require("./routes/authentication.route");
const passport_config_1 = require("./config/passport.config");
const memorystore_1 = __importDefault(require("memorystore"));
const app = express_1.default();
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
// Allow Cross-Origin requests
const sessionConfig = {
    resave: false,
    saveUninitialized: true,
    secret: "memorystore",
};
if (["production", "staging"].includes(process.env.NODE_ENV || "")) {
    app.set("trust proxy", 1); // trust first proxy
    const MemoryStore = memorystore_1.default(express_session_1.default);
    app.use(express_session_1.default(Object.assign(Object.assign({}, sessionConfig), { store: new MemoryStore({}) })));
}
else {
    app.use(express_session_1.default(sessionConfig));
}
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
// Setup Sequelize connection with the database
const config = new sequelize_1.ConfigSequelize();
config.setupConnection();
// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
    app.use(morgan_1.default("dev"));
}
// Security
if (process.env.NODE_ENV === "production") {
    app.use(helmet_1.default());
}
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_config_1.configPassport();
passport_1.default.serializeUser(function (user, cb) {
    cb(null, user);
});
passport_1.default.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
app.use("/auth", authentication_route_1.routes);
// Add APIs
routes_1.RegisterRoutes(app);
/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
const staticDir = path_1.default.join(__dirname, "/assets");
global.assetDir = staticDir;
app.use(express_1.default.static(staticDir));
// const viewsDir = path.join(__dirname, "views");
// app.set("views", viewsDir);
// app.get("*", (_req: Request, res: Response) => {
//   res.sendFile("index.html", { root: viewsDir });
// });
// Handle error
errorHandler_1.handle404(app);
errorHandler_1.handleError(app);
exports.default = app;
