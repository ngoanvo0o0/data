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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Website = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class Website extends sequelize_1.Model {
    static initModel(sequelize) {
        Website.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            logo: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            footerContent: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                field: 'footer_content'
            },
            facebookUrl: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'facebook_url'
            },
            twitterUrl: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'twitter_url'
            },
            googleUrl: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'google_url'
            },
            linkedinUrl: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'linkedin_url'
            },
            isDeleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                field: 'is_deleted'
            },
            createdBy: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                field: 'created_by'
            },
            updatedBy: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                field: 'updated_by'
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('now'),
                field: 'created_at'
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.Sequelize.fn('now'),
                field: 'updated_at'
            }
        }, {
            sequelize,
            tableName: 'website',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: "website_pkey",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        });
        return Website;
    }
}
exports.Website = Website;
