import { Controller, HttpStatus } from "@nestjs/common";
import { IMessage } from "./interfaces/message.interface";
import { MessageService } from "./messages.service";
import { MessagePattern } from '@nestjs/microservices';
import { IResponse } from "../common/response.interface";

@Controller()
export class MessagesController {
  constructor(private readonly messageService: MessageService) { }

  @MessagePattern({ cmd: 'messages_search_by_room' })
  public async messagesSearchByRoom(room: string): Promise<IResponse<IMessage[]>> {
    let result: IResponse<IMessage[]>;

    if (room) {
      const messages = await this.messageService.getMessagesByRoom(room);
      result = {
        status: HttpStatus.OK,
        message: 'messages_search_by_room_success',
        data: messages
      };
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'messages_search_by_room_bad_request',
        data: null
      };
    }

    return result;
  }

  @MessagePattern({ cmd: 'message_create' })
  public async messageCreate(message: IMessage): Promise<IResponse<IMessage>> {
    let result: IResponse<IMessage>;

    if (message) {
      try {
        const createdMessage = await this.messageService.createMessage(message);
        result = {
          status: HttpStatus.CREATED,
          message: 'message_create_success',
          data: createdMessage,
          errors: null
        };
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'message_create_precondition_failed',
          data: null,
          errors: e.errors
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'message_create_bad_request',
        data: null,
        errors: null
      };
    }

    return result;
  }
}