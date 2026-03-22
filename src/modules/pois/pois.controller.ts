import { Controller, Get, Query, ParseFloatPipe, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PoisService } from './pois.service';

@ApiTags('pois')
@Controller('pois')
export class PoisController {
  constructor(private readonly poisService: PoisService) {}

  @Get('nearest')
  @ApiOperation({
    summary: 'Obtener estaciones priorizadas por preferencia dentro del rango de autonomía',
  })
  @ApiQuery({ name: 'lat', type: Number, description: 'Latitud actual' })
  @ApiQuery({ name: 'lon', type: Number, description: 'Longitud actual' })
  @ApiQuery({ name: 'vehicleId', type: String, description: 'UUID del vehículo' })
  @ApiQuery({ name: 'rangeKm', type: Number, description: 'Autonomía real disponible (Km)' })
  @ApiResponse({ status: 200, description: 'Lista de estaciones más cercanas ordenadas por preferencia.' })
  findNearestByPreference(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
    @Query('vehicleId') vehicleId: string,
    @Query('rangeKm', ParseFloatPipe) rangeKm: number,
  ) {
    return this.poisService.findNearestByPreference(lat, lon, vehicleId, rangeKm);
  }
}
