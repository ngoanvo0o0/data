"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModels = exports.Website = exports.Users = exports.UserHistories = exports.Tags = exports.Roles = exports.RolePermissions = exports.RaoVats = exports.Qas = exports.Permissions = exports.NewsTags = exports.News = exports.Migrations = exports.Menu = exports.Media = exports.Documents = exports.Configs = exports.Comments = exports.Categories = exports.Ads = void 0;
const Ads_1 = require("./Ads");
Object.defineProperty(exports, "Ads", { enumerable: true, get: function () { return Ads_1.Ads; } });
const Categories_1 = require("./Categories");
Object.defineProperty(exports, "Categories", { enumerable: true, get: function () { return Categories_1.Categories; } });
const Comments_1 = require("./Comments");
Object.defineProperty(exports, "Comments", { enumerable: true, get: function () { return Comments_1.Comments; } });
const Configs_1 = require("./Configs");
Object.defineProperty(exports, "Configs", { enumerable: true, get: function () { return Configs_1.Configs; } });
const Documents_1 = require("./Documents");
Object.defineProperty(exports, "Documents", { enumerable: true, get: function () { return Documents_1.Documents; } });
const Media_1 = require("./Media");
Object.defineProperty(exports, "Media", { enumerable: true, get: function () { return Media_1.Media; } });
const Menu_1 = require("./Menu");
Object.defineProperty(exports, "Menu", { enumerable: true, get: function () { return Menu_1.Menu; } });
const Migrations_1 = require("./Migrations");
Object.defineProperty(exports, "Migrations", { enumerable: true, get: function () { return Migrations_1.Migrations; } });
const News_1 = require("./News");
Object.defineProperty(exports, "News", { enumerable: true, get: function () { return News_1.News; } });
const NewsTags_1 = require("./NewsTags");
Object.defineProperty(exports, "NewsTags", { enumerable: true, get: function () { return NewsTags_1.NewsTags; } });
const Permissions_1 = require("./Permissions");
Object.defineProperty(exports, "Permissions", { enumerable: true, get: function () { return Permissions_1.Permissions; } });
const Qas_1 = require("./Qas");
Object.defineProperty(exports, "Qas", { enumerable: true, get: function () { return Qas_1.Qas; } });
const RaoVats_1 = require("./RaoVats");
Object.defineProperty(exports, "RaoVats", { enumerable: true, get: function () { return RaoVats_1.RaoVats; } });
const RolePermissions_1 = require("./RolePermissions");
Object.defineProperty(exports, "RolePermissions", { enumerable: true, get: function () { return RolePermissions_1.RolePermissions; } });
const Roles_1 = require("./Roles");
Object.defineProperty(exports, "Roles", { enumerable: true, get: function () { return Roles_1.Roles; } });
const Tags_1 = require("./Tags");
Object.defineProperty(exports, "Tags", { enumerable: true, get: function () { return Tags_1.Tags; } });
const UserHistories_1 = require("./UserHistories");
Object.defineProperty(exports, "UserHistories", { enumerable: true, get: function () { return UserHistories_1.UserHistories; } });
const Users_1 = require("./Users");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return Users_1.Users; } });
const Website_1 = require("./Website");
Object.defineProperty(exports, "Website", { enumerable: true, get: function () { return Website_1.Website; } });
function initModels(sequelize) {
    Ads_1.Ads.initModel(sequelize);
    Categories_1.Categories.initModel(sequelize);
    Comments_1.Comments.initModel(sequelize);
    Configs_1.Configs.initModel(sequelize);
    Documents_1.Documents.initModel(sequelize);
    Media_1.Media.initModel(sequelize);
    Menu_1.Menu.initModel(sequelize);
    Migrations_1.Migrations.initModel(sequelize);
    News_1.News.initModel(sequelize);
    NewsTags_1.NewsTags.initModel(sequelize);
    Permissions_1.Permissions.initModel(sequelize);
    Qas_1.Qas.initModel(sequelize);
    RaoVats_1.RaoVats.initModel(sequelize);
    RolePermissions_1.RolePermissions.initModel(sequelize);
    Roles_1.Roles.initModel(sequelize);
    Tags_1.Tags.initModel(sequelize);
    UserHistories_1.UserHistories.initModel(sequelize);
    Users_1.Users.initModel(sequelize);
    Website_1.Website.initModel(sequelize);
    Categories_1.Categories.belongsTo(Categories_1.Categories, { as: "parent", foreignKey: "parentId" });
    Categories_1.Categories.hasMany(Categories_1.Categories, { as: "categories", foreignKey: "parentId" });
    Menu_1.Menu.belongsTo(Categories_1.Categories, { as: "category", foreignKey: "categoryId" });
    Categories_1.Categories.hasMany(Menu_1.Menu, { as: "menus", foreignKey: "categoryId" });
    News_1.News.belongsTo(Categories_1.Categories, { as: "category", foreignKey: "categoryId" });
    Categories_1.Categories.hasMany(News_1.News, { as: "newss", foreignKey: "categoryId" });
    RaoVats_1.RaoVats.belongsTo(Categories_1.Categories, { as: "category", foreignKey: "categoryId" });
    Categories_1.Categories.hasMany(RaoVats_1.RaoVats, { as: "raoVats", foreignKey: "categoryId" });
    Comments_1.Comments.belongsTo(News_1.News, { as: "news", foreignKey: "newsId" });
    News_1.News.hasMany(Comments_1.Comments, { as: "comments", foreignKey: "newsId" });
    NewsTags_1.NewsTags.belongsTo(News_1.News, { as: "news", foreignKey: "newsId" });
    News_1.News.hasMany(NewsTags_1.NewsTags, { as: "newsTags", foreignKey: "newsId" });
    RolePermissions_1.RolePermissions.belongsTo(Permissions_1.Permissions, { as: "permission", foreignKey: "permissionId" });
    Permissions_1.Permissions.hasMany(RolePermissions_1.RolePermissions, { as: "rolePermissions", foreignKey: "permissionId" });
    Comments_1.Comments.belongsTo(RaoVats_1.RaoVats, { as: "raoVat", foreignKey: "raoVatId" });
    RaoVats_1.RaoVats.hasMany(Comments_1.Comments, { as: "comments", foreignKey: "raoVatId" });
    RolePermissions_1.RolePermissions.belongsTo(Roles_1.Roles, { as: "role", foreignKey: "roleId" });
    Roles_1.Roles.hasMany(RolePermissions_1.RolePermissions, { as: "rolePermissions", foreignKey: "roleId" });
    Users_1.Users.belongsTo(Roles_1.Roles, { as: "role", foreignKey: "roleId" });
    Roles_1.Roles.hasMany(Users_1.Users, { as: "users", foreignKey: "roleId" });
    NewsTags_1.NewsTags.belongsTo(Tags_1.Tags, { as: "tag", foreignKey: "tagId" });
    Tags_1.Tags.hasMany(NewsTags_1.NewsTags, { as: "newsTags", foreignKey: "tagId" });
    Comments_1.Comments.belongsTo(Users_1.Users, { as: "user", foreignKey: "userId" });
    Users_1.Users.hasMany(Comments_1.Comments, { as: "comments", foreignKey: "userId" });
    News_1.News.belongsTo(Users_1.Users, { as: "user", foreignKey: "userId" });
    Users_1.Users.hasMany(News_1.News, { as: "newss", foreignKey: "userId" });
    Qas_1.Qas.belongsTo(Users_1.Users, { as: "user", foreignKey: "userId" });
    Users_1.Users.hasMany(Qas_1.Qas, { as: "qas", foreignKey: "userId" });
    UserHistories_1.UserHistories.belongsTo(Users_1.Users, { as: "user", foreignKey: "userId" });
    Users_1.Users.hasMany(UserHistories_1.UserHistories, { as: "userHistories", foreignKey: "userId" });
    return {
        Ads: Ads_1.Ads,
        Categories: Categories_1.Categories,
        Comments: Comments_1.Comments,
        Configs: Configs_1.Configs,
        Documents: Documents_1.Documents,
        Media: Media_1.Media,
        Menu: Menu_1.Menu,
        Migrations: Migrations_1.Migrations,
        News: News_1.News,
        NewsTags: NewsTags_1.NewsTags,
        Permissions: Permissions_1.Permissions,
        Qas: Qas_1.Qas,
        RaoVats: RaoVats_1.RaoVats,
        RolePermissions: RolePermissions_1.RolePermissions,
        Roles: Roles_1.Roles,
        Tags: Tags_1.Tags,
        UserHistories: UserHistories_1.UserHistories,
        Users: Users_1.Users,
        Website: Website_1.Website,
    };
}
exports.initModels = initModels;
