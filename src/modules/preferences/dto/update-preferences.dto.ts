import {
  IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean, Min, Max, MaxLength, IsArray, ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePreferencesDto {
  @ApiProperty({ description: 'UUID del vehículo' })
  @IsString()
  vehicleId: string;

  @ApiProperty({
    description: 'Lista ordenada de marcas preferidas',
    example: [
      { brandName: 'Terpel', priority: 1, onlyHighway: false },
      { brandName: 'Primax', priority: 2, onlyHighway: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreferenceItemDto)
  preferences: PreferenceItemDto[];

  @ApiPropertyOptional({ description: 'Marcas excluidas', example: ['BP', 'Mobil'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedBrands?: string[];

  @ApiPropertyOptional({ description: 'Avisar buscar gasolina Q km antes de vacío', example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  notifyGasStationKmBefore?: number;

  @ApiPropertyOptional({ description: 'Avisar descanso tras HH horas de viaje', example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  notifyRestStopHours?: number;

  @ApiPropertyOptional({ description: 'Límite de velocidad máximo permitido', example: 100 })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(200)
  maxSpeedLimit?: number;
}

export class PreferenceItemDto {
  @ApiProperty({ description: 'Nombre de la marca de combustible', example: 'Terpel' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  brandName: string;

  @ApiProperty({ description: 'Nivel de prioridad (1 = mayor, 10 = menor)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(10)
  priority: number;

  @ApiPropertyOptional({ description: 'Solo sugerir en carretera', example: false })
  @IsOptional()
  @IsBoolean()
  onlyHighway?: boolean;
}
