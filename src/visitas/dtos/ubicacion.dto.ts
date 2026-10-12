import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class UbicacionDto {
  @ApiProperty({ example: -17.7833, description: 'Latitud entre -90 y 90' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @ApiProperty({ example: -63.1821, description: 'Longitud entre -180 y 180' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}