import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { ResponseDto } from './interfaces/common/response.dto';
import { IRoom } from './interfaces/rooms/room.interface';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateUpdateRoomRequestDto } from './interfaces/rooms/create-update-room-request.dto';

@Controller('/api/rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Get()
  @ApiOkResponse({
    type: ResponseDto<IRoom[]>,
    description: 'List of rooms'
  })
  async roomsList(): Promise<ResponseDto<IRoom[]>> {
    let result: ResponseDto<IRoom[]>;

    const rooms = await this.roomService.getRooms()
    result = {
      status: HttpStatus.OK,
      message: 'rooms_list_success',
      data: rooms,
      errors: null
    };

    return result;
  }

  @Post()
  @ApiCreatedResponse({
    type: ResponseDto<IRoom>
  })
  async createRoom(
    @Body() roomRequest: CreateUpdateRoomRequestDto
  ): Promise<ResponseDto<IRoom>> {
    let result: ResponseDto<IRoom>;

    if (roomRequest) {
      try {
        const createdRoom = await this.roomService.createRoom(roomRequest);
        result = {
          status: HttpStatus.CREATED,
          message: 'room_create_success',
          data: createdRoom,
          errors: null
        };
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

    return result;
  }
}
