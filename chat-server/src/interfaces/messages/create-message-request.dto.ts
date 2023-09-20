import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageRequestDto {
  @ApiProperty({ example: 'yasmany@gmail.com' })
  sender: string;

  @ApiProperty({ example: 'Room 1' })
  room: string;

  @ApiProperty({ example: '<p>Hello world</p>' })
  message: string;

  @ApiProperty({ example: '1695153175993' })
  time: number;
}