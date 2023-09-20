import { Controller, HttpStatus } from "@nestjs/common";
import { IRoom } from "./interfaces/room.interface";
import { MessagePattern } from '@nestjs/microservices';
import { IResponse } from "../common/response.interface";
import { RoomService } from "./rooms.service";

@Controller()
export class RoomsController {
  constructor(private readonly roomService: RoomService) { }

  @MessagePattern({ cmd: 'room_list' })
  public async roomList(room: string): Promise<IResponse<IRoom[]>> {
    let result: IResponse<IRoom[]>;

    if (room) {
      const rooms = await this.roomService.getRooms();
      result = {
        status: HttpStatus.OK,
        message: 'room_list_success',
        data: rooms
      };
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'room_list_bad_request',
        data: null
      };
    }

    return result;
  }

  @MessagePattern({ cmd: 'room_create' })
  public async roomCreate(room: IRoom): Promise<IResponse<IRoom>> {
    let result: IResponse<IRoom>;

    if (room) {
      try {
        const createdRoom = await this.roomService.createRoom(room);
        result = {
          status: HttpStatus.CREATED,
          message: 'room_create_success',
          data: createdRoom,
          errors: null
        };
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'room_create_precondition_failed',
          data: null,
          errors: e.errors
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