import {
  GetUsersByIdResponse,
  GetUsersResponse,
  UpsertUserRequest,
  UpsertUserResponse,
  UpsertCategoryRequest,
  UpsertCategoryResponse,
  GetCategoryByIdResponse,
  GetCategoriesResponse,
  SelectOptionResponse,
  NewsResponse,
  NewsRequest,
  GetRaoVatResponse,
  RaoVatResponse,
  RaoVatRequest,
  GetMenuResponse,
  MenuRequest,
  MenuResponse,
  ConfigRequest,
  ConfigResponse,
  WebsiteRequest,
  WebsiteResponse,
  DashBoardResponse,
  TotalNewsOfMonthResponse,
  GetNewsOfMemberResponse,
  GetNewsDetailsOfMembersResponse,
} from ".";
import { AdminConsoleRoleService } from "../../services/admin-console/role.service";
import { AdminConsoleUSerService } from "../../services/admin-console/user.service";
import { AdminConsoleCategoryService } from "../../services/admin-console/categories.service";
import { AdminConsoleNewsService } from "../../services/admin-console/news.service";

import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Queries,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { AdminConsoleRaoVatService } from "../../services/admin-console/raovat.service";
import { AdminConsoleTagsService } from "../../services/admin-console/tag.service";
import { PagedList, PaginationQuery } from "../../dtos/pagination.dto";
import { NewsDto, PagedNewsItemDto } from "../../dtos/news.dto";
import { AdminConsoleMenuService } from "../../services/admin-console/menu.service";
import { Request as ExRequest } from "express";
import { AuthenticationInfo } from "../../dtos/authentication.dto";
import { CategoryQuery } from "../../dtos/category.dto";
import { AdminConsoleTeamService } from "../../services/admin-console/team.service";
import { AdminConsoleConfigService } from "../../services/admin-console/config.service";
import { AdminConsoleWebsiteService } from "../../services/admin-console/website.service";
import {
  listHistories,
  logVisit,
} from "../../services/admin-console/histories.service";
import { HistoryDto, HistoryEntityType } from "../../dtos/history.dto";
import { AdminConsoleDashboardService } from "../../services/admin-console/dashboard.service";
import { AdminConsoleReport } from "../../services/admin-console/reports.service";
import { FileService } from "../../services/file.service";
import { FileDto } from "../../dtos/common";
import { CommentDto } from "../../dtos/comment.dot";
import { Permissions } from "../../constants/permission.constant";

@Route("admin-console")
@Tags("AdminConsole")
export class AdminConsoleController extends Controller {
  @Security("", [Permissions.MANAGE_USERS_VIEW])
  @Get("users")
  public async getUsers(): Promise<GetUsersResponse> {
    return new AdminConsoleUSerService().getUsers();
  }

  @Security("")
  @Get("users/{userId}")
  public async getUsersById(
    @Path() userId: string,
    @Request() request: ExRequest
  ): Promise<GetUsersByIdResponse> {
    const result = await new AdminConsoleUSerService().getUsersById(userId);
    const currentUser = (request.authInfo as AuthenticationInfo)?.userId;
    if (currentUser) {
      const data = result.data;
      logVisit(currentUser, data.id, data.name!, HistoryEntityType.User);
    }
    return result;
  }

  @Security("", [Permissions.MANAGE_USERS_ENABLE])
  @Post("users")
  public async upsertUser(
    @Body() userRequest: UpsertUserRequest,
    @Request() request: ExRequest
  ): Promise<UpsertUserResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleUSerService().upsertUser(userRequest, currentUser);
  }

  @Security("", [Permissions.MANAGE_USERS_DISABLE])
  @Delete("users/{userId}")
  public async deleteUser(
    @Path() userId: string,
    @Request() request: ExRequest
  ): Promise<void> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleUSerService().deleteUser(userId, currentUser);
  }

  @Security("", [Permissions.MANAGE_MEMBER_VIEW])
  @Get("team")
  public async getTeam(): Promise<GetUsersResponse> {
    return new AdminConsoleTeamService().getTeam();
  }

  @Security("", [Permissions.MANAGE_MEMBER_VIEW])
  @Get("team/{userId}")
  public async getTeamById(
    @Path() userId: string,
    @Request() request: ExRequest
  ): Promise<GetUsersByIdResponse> {
    const result = await new AdminConsoleTeamService().getTeamById(userId);
    const currentUser = (request.authInfo as AuthenticationInfo)?.userId;
    if (currentUser) {
      const data = result.data;
      logVisit(currentUser, data.id, data.name!, HistoryEntityType.Team);
    }
    return result;
  }

  @Security("", [Permissions.MANAGE_MEMBER_ADD])
  @Post("team")
  public async upsertTeam(
    @Body() userRequest: UpsertUserRequest,
    @Request() request: ExRequest
  ): Promise<UpsertUserResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleTeamService().upsertTeam(userRequest, currentUser);
  }

  @Security("", [Permissions.MANAGE_MEMBER_DELETE])
  @Delete("team/{userId}")
  public async deleteTeam(@Path() userId: string): Promise<void> {
    return new AdminConsoleTeamService().deleteTeam(userId);
  }

  @Security("")
  @Get("select/roles")
  public async getSelectRoles(): Promise<SelectOptionResponse> {
    return new AdminConsoleRoleService().getSelectRoles();
  }

  @Security("")
  @Get("select/categories/{type}")
  public async getSelectCategories(
    @Path() type?: string
  ): Promise<SelectOptionResponse> {
    return new AdminConsoleCategoryService().getSelectCategories(type);
  }

  @Get("categories/parents")
  public async getCategoriesParenst(): Promise<GetCategoriesResponse> {
    return new AdminConsoleCategoryService().getCategories();
  }

  @Get("categories")
  public async getCategories(
    @Queries() queries?: CategoryQuery
  ): Promise<GetCategoriesResponse> {
    return new AdminConsoleCategoryService().getCategories(queries);
  }

  @Get("categories/{categoryId}")
  public async getCategoriesById(
    @Path() categoryId: string
  ): Promise<GetCategoryByIdResponse> {
    return new AdminConsoleCategoryService().getCategorysById(categoryId);
  }

  @Security("", [Permissions.MANAGE_CATEGORY_ADD])
  @Post("categories")
  public async upsertCategory(
    @Body() userRequest: UpsertCategoryRequest,
    @Request() request: ExRequest
  ): Promise<UpsertCategoryResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleCategoryService().upsertCategory(
      userRequest,
      currentUser
    );
  }

  @Security("", [Permissions.MANAGE_CATEGORY_DELETE])
  @Delete("categories/{categoryId}")
  public async deleteCategory(@Path() categoryId: string): Promise<void> {
    return new AdminConsoleCategoryService().deleteCategory(categoryId);
  }

  @Get("news")
  public async getNews(
    @Queries() pagination: PaginationQuery
  ): Promise<PagedList<PagedNewsItemDto>> {
    return new AdminConsoleNewsService().getNews(pagination);
  }

  @Get("news/{slug}")
  public async getNewsBySlug(@Path() slug: string): Promise<NewsDto> {
    return new AdminConsoleNewsService().getNewsBySlug(slug);
  }

  @Security("", [Permissions.MANAGE_POST_ADD])
  @Post("news")
  public async upsertNews(
    @Body() newsRequest: NewsRequest,
    @Request() request: ExRequest
  ): Promise<NewsResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleNewsService().upsertNews(newsRequest, currentUser);
  }

  @Security("", [Permissions.MANAGE_POST_DELETE])
  @Delete("news/{newsId}")
  public async deleteNews(
    @Path() newsId: string,
    @Request() request: ExRequest
  ): Promise<void> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleNewsService().deleteNews(newsId, currentUser);
  }

  @Security("", [Permissions.MANAGE_POST_EDIT])
  @Put("news/{newsId}/change-status")
  public async changeStatusNews(
    @Path() newsId: string,
    @Request() request: ExRequest
  ): Promise<void> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleNewsService().changeStatusNews(newsId, currentUser);
  }

  @Get("rao-vat")
  public async getRaoVats(): Promise<GetRaoVatResponse> {
    return new AdminConsoleRaoVatService().getRaoVats();
  }

  @Get("rao-vat/{raoVatId}")
  public async getRaoVatsById(
    @Path() raoVatId: string,
    @Request() request: ExRequest
  ): Promise<RaoVatResponse> {
    const result = await new AdminConsoleRaoVatService().getRaoVatsById(
      raoVatId
    );
    const currentUser = (request.authInfo as AuthenticationInfo)?.userId;
    if (currentUser) {
      const data = result.data;
      logVisit(currentUser, data.id, data.title!, HistoryEntityType.RaoVat);
    }
    return result;
  }

  @Security("", [Permissions.RAOVAT_ADD])
  @Post("rao-vat")
  public async upsertRaoVat(
    @Body() raoVatRequest: RaoVatRequest,
    @Request() request: ExRequest
  ): Promise<RaoVatResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleRaoVatService().upsertRaoVat(
      raoVatRequest,
      currentUser
    );
  }

  @Security("", [Permissions.RAOVAT_DELETE])
  @Delete("rao-vat/{raoVatId}")
  public async deleteRaoVat(
    @Path() raoVatId: string,
    @Request() request: ExRequest
  ): Promise<void> {
    const currentUser = (request.authInfo as AuthenticationInfo)?.userId;
    return new AdminConsoleRaoVatService().deleteRaoVat(raoVatId, currentUser);
  }

  @Get("select/tags")
  public async getSelectTags(): Promise<SelectOptionResponse> {
    return new AdminConsoleTagsService().getSelectTags();
  }

  @Get("menus")
  public async getMenus(): Promise<GetMenuResponse> {
    return new AdminConsoleMenuService().getMenus();
  }

  @Get("menus/{menuId}")
  public async getMenusById(@Path() menuId: string): Promise<MenuResponse> {
    return new AdminConsoleMenuService().getMenusById(menuId);
  }

  @Security("", [Permissions.CONFIG_MENU_ADD])
  @Post("menus")
  public async upsertMenu(
    @Body() menuRequest: MenuRequest,
    @Request() request: ExRequest
  ): Promise<MenuResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleMenuService().upsertMenu(menuRequest, currentUser);
  }

  @Security("", [Permissions.CONFIG_MENU_DELETE])
  @Delete("menus/{menuId}")
  public async deleteMenu(@Path() menuId: string): Promise<void> {
    return new AdminConsoleMenuService().deleteMenu(menuId);
  }

  @Get("configs/{key}")
  public async getConfigByKey(@Path() key: string): Promise<ConfigResponse> {
    return new AdminConsoleConfigService().getConfigByKey(key);
  }

  @Security("", [Permissions.CONFIG_SEO_EDIT])
  @Post("configs")
  public async upsertConfig(
    @Body() configRequest: ConfigRequest,
    @Request() request: ExRequest
  ): Promise<ConfigResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleConfigService().upsertConfig(
      configRequest,
      currentUser
    );
  }

  @Get("website")
  public async getWebsite(): Promise<WebsiteResponse> {
    return new AdminConsoleWebsiteService().getWebsite();
  }

  @Security("", [Permissions.CONFIG_SEO_EDIT])
  @Post("website")
  public async upsertWebsite(
    @Body() websiteRequest: WebsiteRequest,
    @Request() request: ExRequest
  ): Promise<WebsiteResponse> {
    const currentUser = (request.authInfo as AuthenticationInfo).userId;
    return new AdminConsoleWebsiteService().upsertWebsite(
      websiteRequest,
      currentUser
    );
  }

  @Security("", [Permissions.HISTORY_ACTIVITY_TEAM])
  @Get("histories")
  public async getHistories(): Promise<HistoryDto[]> {
    return await listHistories();
  }

  @Get("dashboard")
  public async getDashboard(): Promise<DashBoardResponse> {
    return await new AdminConsoleDashboardService().getDashBoard();
  }

  @Get("reports/total-news-of-month")
  public async getTotalNewsOfMonth(): Promise<TotalNewsOfMonthResponse> {
    return await new AdminConsoleReport().getTotalNewsOfMonth();
  }

  @Get("reports/news-of-members")
  public async getNewsOfMembers(): Promise<GetNewsOfMemberResponse> {
    return await new AdminConsoleReport().getNewsOfMembers();
  }

  @Get("reports/news-details-by/{userId}/months/{month}")
  public async getNewsDetailsOfMembers(
    @Path() userId: string,
    @Path() month: string
  ): Promise<GetNewsDetailsOfMembersResponse> {
    return await new AdminConsoleReport().getNewsDetailsOfMembers(
      userId,
      month
    );
  }

  @Get("image-urls")
  public async getAllImageUrl(): Promise<{
    categoriesImages: FileDto[];
    adImages: FileDto[];
    raoVatImages: FileDto[];
  }> {
    const assetDir = (global as any).assetDir;
    return new FileService().getAllImageUrls(assetDir);
  }

  @Security("")
  @Delete("remove-images")
  public async removeImages(
    @Queries() queries: { images: string[] }
  ): Promise<void> {
    await new FileService().removeImages(queries.images);
  }

  @Get("contact-histories")
  public async contactHistories(): Promise<{ data: CommentDto[] }> {
    return {
      data: await new AdminConsoleConfigService().contactHistories(),
    };
  }
}
