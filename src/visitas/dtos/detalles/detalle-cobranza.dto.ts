import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class DetalleCobranzaDto {
  @ApiProperty({ example: 1500.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  montoCobrado!: number;

  @ApiProperty({ enum: ['BOB', 'USD'], example: 'BOB' })
  @IsIn(['BOB', 'USD'])
  moneda!: 'BOB' | 'USD';

  @ApiProperty({ example: 'REC-2026-001' })
  @IsString()
  @IsNotEmpty()
  comprobante!: string;
}