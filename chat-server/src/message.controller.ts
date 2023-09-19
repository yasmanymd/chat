import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ResponseDto } from './interfaces/common/response.dto';
import { CreateMessageRequestDto } from './interfaces/messages/create-message-request.dto';
import { IMessage } from './interfaces/messages/message.interface';

@Controller('messages')
export class MessageController {
  constructor(@Inject('MESSAGE_SERVICE') private readonly messageService: ClientProxy) { }

  @Post()
  @ApiCreatedResponse({
    type: ResponseDto<IMessage>
  })
  async createMessage(
    @Body() messageRequest: CreateMessageRequestDto
  ): Promise<Observable<ResponseDto<IMessage>>> {
    return this.messageService.send({ cmd: 'message_create' }, messageRequest);
  }

  @Get('/search?')
  @ApiOkResponse({
    type: ResponseDto<IMessage[]>,
    description: 'List of messages'
  })
  public async getMessages(
    @Query('room') room: string
  ): Promise<Observable<ResponseDto<IMessage[]>>> {
    return this.messageService.send({ cmd: 'messages_search_by_room' }, room);
  }
}
