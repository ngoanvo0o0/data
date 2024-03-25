"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSequelize = void 0;
const sequelize_1 = require("sequelize");
const init_models_1 = require("./models/init-models");
class ConfigSequelize {
    constructor() {
        this.sequelize = null;
        if (!ConfigSequelize._instance) {
            console.log("creating instance ConfigSequelize");
            ConfigSequelize._instance = this;
        }
        else {
            console.log("retrieve instance ConfigSequelize");
            return ConfigSequelize._instance;
        }
    }
    static getInstance() {
        return ConfigSequelize._instance;
    }
    setupConnection() {
        if (this.sequelize) {
            return;
        }
        const host = process.env.POSTGRES_HOST || '';
        const port = Number.parseInt(process.env.POSTGRES_PORT || '5432');
        const user = process.env.POSTGRES_USER || '';
        const pass = process.env.POSTGRES_PASSWORD || '';
        const database = process.env.POSTGRES_DATABASE || '';
        // this.sequelize = new Sequelize(`postgresql://${user}:${pass}@${host}:${port}/${database}`);
        this.sequelize = new sequelize_1.Sequelize({
            logging: console.log,
            host: host,
            port: port,
            database: database,
            dialect: 'postgres',
            username: user,
            password: pass,
            logQueryParameters: true,
        });
        init_models_1.initModels(this.sequelize);
        console.log("Connection to database concluded");
    }
}
exports.ConfigSequelize = ConfigSequelize;
ConfigSequelize._instance = null;
