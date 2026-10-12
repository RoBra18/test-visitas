import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class DetalleReclamoDto {
  @ApiProperty({ example: 'Mercadería dañada en transporte' })
  @IsString()
  @IsNotEmpty()
  motivo!: string;

  @ApiProperty({ enum: ['ALTA', 'MEDIA', 'BAJA'], example: 'MEDIA' })
  @IsIn(['ALTA', 'MEDIA', 'BAJA'])
  prioridad!: 'ALTA' | 'MEDIA' | 'BAJA';
}