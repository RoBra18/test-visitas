import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductoOfrecidoDto {
  @ApiProperty({ example: 'LAP-001' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ enum: ['ALTO', 'MEDIO', 'BAJO'], example: 'ALTO' })
  @IsIn(['ALTO', 'MEDIO', 'BAJO'])
  interes!: 'ALTO' | 'MEDIO' | 'BAJO';
}

export class DetalleVentaDto {
  @ApiProperty({ type: [ProductoOfrecidoDto] })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductoOfrecidoDto)
  productosOfrecidos!: ProductoOfrecidoDto[];

  @ApiProperty({ example: false })
  @IsBoolean()
  pedidoGenerado!: boolean;
}