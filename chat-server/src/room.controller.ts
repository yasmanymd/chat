import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { ResponseDto } from './interfaces/common/response.dto';
import { IRoom } from './interfaces/rooms/room.interface';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateUpdateRoomRequestDto } from './interfaces/rooms/create-update-room-request.dto';
import { Observable, first, from, map, of } from 'rxjs';

@Controller('/api/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Get()
  @ApiOkResponse({
    type: ResponseDto<IRoom[]>,
    description: 'List of rooms'
  })
  async roomsList(): Promise<Observable<ResponseDto<IRoom[]>>> {
    try {
      const res = this.roomService.getRooms();
      return from(res).pipe(
        map((r: ResponseDto<IRoom[]>) => r)
      );
    } catch (err) {
      return of({
        status: HttpStatus.PRECONDITION_FAILED,
        message: 'room_list_precondition_failed',
        data: null,
        errors: [{ message: err.message }]
      });
    }
  }

  @Post()
  @ApiCreatedResponse({
    type: ResponseDto<IRoom>
  })
  async createRoom(
    @Body() roomRequest: CreateUpdateRoomRequestDto
  ): Promise<Observable<ResponseDto<IRoom>>> {
    let result: ResponseDto<IRoom>;

    if (roomRequest) {
      try {
        const res = this.roomService.createRoom(roomRequest);
        return from(res).pipe(map((createdRoom: ResponseDto<IRoom>) => createdRoom));
      } catch (err) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'job_create_precondition_failed',
          data: null,
          errors: [{ message: err.message }]
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'room_create_bad_request',
        data: null,
        errors: null
      };
    }

    return of(result);
  }
}
