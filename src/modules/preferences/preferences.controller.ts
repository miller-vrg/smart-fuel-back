import { Controller, Get, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@ApiTags('preferences')
@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get(':vehicleId')
  @ApiOperation({ summary: 'Obtener preferencias de parada por vehículo' })
  @ApiParam({ name: 'vehicleId', description: 'UUID del vehículo' })
  @ApiResponse({ status: 200, description: 'Preferencias obtenidas exitosamente.' })
  @ApiResponse({ status: 404, description: 'Preferencias o vehículo no encontrado.' })
  getByVehicle(@Param('vehicleId', ParseUUIDPipe) vehicleId: string) {
    return this.preferencesService.getByVehicle(vehicleId);
  }

  @Put()
  @ApiOperation({ summary: 'Guardar/actualizar preferencias (reemplaza todo)' })
  @ApiResponse({ status: 200, description: 'Preferencias actualizadas con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos de preferencias inválidos.' })
  updatePreferences(@Body() dto: UpdatePreferencesDto) {
    return this.preferencesService.updatePreferences(dto);
  }
}
