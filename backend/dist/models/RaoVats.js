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
exports.RaoVats = void 0;
const Sequelize = __importStar(require("sequelize"));
const sequelize_1 = require("sequelize");
class RaoVats extends sequelize_1.Model {
    static initModel(sequelize) {
        RaoVats.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true
            },
            title: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            imageurl: {
                type: sequelize_1.DataTypes.STRING(100),
                allowNull: true
            },
            categoryId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                field: 'category_id'
            },
            publishDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                field: 'publish_date'
            },
            slug: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
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
            },
            facebook: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            phoneNumber: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'phone_number'
            },
            contactName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'contact_name'
            },
            metaKeyword: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'meta_keyword'
            },
            view: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            extraImages: {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
                allowNull: true,
                field: 'extra_images'
            },
            websiteUrl: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                field: 'website_url'
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            address: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            description: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("draft", "publish"),
                allowNull: true
            },
            customId: {
                type: sequelize_1.DataTypes.DECIMAL,
                allowNull: true,
                field: 'custom_id'
            }
        }, {
            sequelize,
            tableName: 'rao_vats',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: "rao_vats_pkey",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        });
        return RaoVats;
    }
}
exports.RaoVats = RaoVats;
