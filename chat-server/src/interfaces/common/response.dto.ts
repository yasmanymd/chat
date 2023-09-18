import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<Type> {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'candidate_create_success' })
  message: string;

  @ApiProperty({
    example: {
      data: {
        name: 'Room 1'
      },
    },
    nullable: true,
  })
  data?: Type | null;

  @ApiProperty({ example: null, nullable: true })
  errors?: { [key: string]: any } | null;
}