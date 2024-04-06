import { Configs } from "../../models/Configs"
import { ConfigRequest, ConfigResponse } from "../../apis/admin-console"
import { logHistory } from "./histories.service"
import { HistoryEntityType } from "../../dtos/history.dto"
import {Comments} from "../../models/init-models";
import {CommentDto} from "../../dtos/comment.dot";

export class AdminConsoleConfigService {
  public async getConfigByKey(key: string): Promise<ConfigResponse> {
    const configModel = await Configs.findOne({
      where: {
        isDeleted: false,
        key
      }
    })

    return {
      data: {
        id: configModel?.id,
        value: configModel?.value,
        key: configModel?.key
      }
    }
  }

  public async upsertConfig(configRequest: ConfigRequest, currentUser: string): Promise<ConfigResponse> {
    const [config] = await Configs.upsert({
      id: configRequest.id,
      key: configRequest.key,
      value: configRequest.value,
      type: configRequest.type,
      createdBy: !configRequest.id ? currentUser: undefined,
      updatedBy: currentUser,
      updatedAt: new Date()
    }, {
      returning: true
    })

    logHistory(currentUser, 'update', undefined, undefined, HistoryEntityType.Configuration)

    return {
      data: {
        id: config.id,
        value: config.value
      }
    }
  }

  public async contactHistories(): Promise<CommentDto[]> {
    const contacts = await Comments.findAll({
      where: {
        isDeleted: false,
        newsId: null,
        raoVatId: null
      }
    })

    const result = contacts.map((contact) => {
      return {
        name: contact.anonymousName,
        content: contact.content,
        email: contact.anonymousEmail
      } as CommentDto
    })

    return result
  }
}