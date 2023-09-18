import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateRoomRequestDto {
  @ApiProperty({ example: 'Room 1' })
  name: string;
}