import { Injectable } from '@nestjs/common';
import { IRoom } from './interfaces/rooms/room.interface';

@Injectable()
export class RoomService {
  private rooms: IRoom[];

  constructor() {
    this.rooms = [];
  }

  public async getRooms(): Promise<IRoom[]> {
    return this.rooms;
  }

  public async createRoom(room: IRoom): Promise<IRoom> {
    if (this.rooms.findIndex(item => item.name == room.name) >= 0) {
      throw new Error('Room already exists.');
    }
    this.rooms.push(room);
    return room;
  }
}
