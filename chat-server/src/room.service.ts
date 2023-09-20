import { Inject, Injectable } from '@nestjs/common';
import { IRoom } from './interfaces/rooms/room.interface';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ResponseDto } from './interfaces/common/response.dto';

@Injectable()
export class RoomService {
  private rooms: IRoom[];

  constructor(@Inject('MESSAGE_SERVICE') private readonly messageService: ClientProxy) {
    this.rooms = [];
  }

  public getRooms(): Observable<ResponseDto<IRoom[]>> {
    return this.messageService.send({ cmd: 'room_list' }, {});
  }

  public createRoom(room: IRoom): Observable<ResponseDto<IRoom>> {
    return this.messageService.send({ cmd: 'room_create' }, room);
  }
}
