import {
  Controller, Get, Post, Delete, Param, Body,
  HttpCode, HttpStatus, ParseUUIDPipe, Patch, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from '../../core/entities/vehicle.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo vehículo' })
  @ApiResponse({ status: 201, description: 'El vehículo ha sido creado exitosamente.', type: Vehicle })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  create(@Body() dto: CreateVehicleDto, @Request() req: any) {
    return this.vehicleService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los vehículos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de vehículos obtenida.', type: [Vehicle] })
  findAll(@Request() req: any) {
    return this.vehicleService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiOperation({ summary: 'Obtener un vehículo por su ID' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado.', type: Vehicle })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.vehicleService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos generales del vehículo' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiResponse({ status: 200, description: 'Vehículo actualizado exitosamente.', type: Vehicle })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateVehicleDto, @Request() req: any) {
    return this.vehicleService.update(id, dto, req.user.id);
  }

  @Patch(':id/fuel-level')
  @ApiOperation({ summary: 'Actualizar nivel de combustible en galones' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiQuery({ name: 'gallons', type: Number, description: 'Nivel actual de gasolina en galones' })
  @ApiResponse({ status: 200, description: 'Nivel de combustible actualizado exitosamente.' })
  updateFuelLevel(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('gallons') gallons: number,
    @Request() req: any
  ) {
    return this.vehicleService.updateFuelLevel(id, gallons);
  }

  @Patch(':id/safety-buffer')
  @ApiOperation({ summary: 'Actualizar buffer de seguridad (0.10 - 0.25)' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiQuery({ name: 'buffer', type: Number, description: 'Nuevo buffer de seguridad' })
  @ApiResponse({ status: 200, description: 'Buffer de seguridad actualizado.' })
  updateSafetyBuffer(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('buffer') buffer: number,
    @Request() req: any
  ) {
    return this.vehicleService.updateSafetyBuffer(id, buffer);
  }

  @Patch(':id/active-trip')
  @ApiOperation({ summary: 'Guardar el estado de la ruta activa' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo' })
  @ApiResponse({ status: 200, description: 'Ruta guardada.' })
  updateActiveTrip(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: any,
    @Request() req: any
  ) {
    return this.vehicleService.updateActiveTrip(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  @ApiParam({ name: 'id', description: 'UUID del vehículo a eliminar' })
  @ApiResponse({ status: 204, description: 'Vehículo eliminado con éxito.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.vehicleService.remove(id);
  }
}
