import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ReporteVisitasPorDiaQueryDto {
    @ApiProperty({ description: 'ID del vendedor', example: 'V001' })
    @IsNotEmpty({ message: 'vendedorId es obligatorio' })
    @IsString()
    vendedorId!: string;

    @ApiProperty({
        description: 'Fecha inicio YYYY-MM-DD (hora Bolivia, inclusive)',
        example: '2026-10-01',
    })
    @IsNotEmpty({ message: 'desde es obligatorio' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'desde debe tener el formato YYYY-MM-DD',
    })
    @IsDateString({ strict: true }, {
        message: 'desde debe ser una fecha válida',
    })
    desde!: string;

    @ApiProperty({
        description: 'Fecha fin YYYY-MM-DD (hora Bolivia, inclusive)',
        example: '2026-10-31',
    })
    @IsNotEmpty({ message: 'hasta es obligatorio' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'hasta debe tener el formato YYYY-MM-DD',
    })
    @IsDateString({ strict: true }, {
        message: 'hasta debe ser una fecha válida',
    })
    hasta!: string;
}