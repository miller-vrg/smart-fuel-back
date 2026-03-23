import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StopPreference } from '@core/entities/stop-preference.entity';
import { Vehicle } from '@core/entities/vehicle.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

/**
 * PreferencesService – SRP: gestiona las preferencias de parada.
 * La lógica de degradación (Preferencia 1 → 2 → más cercana) vive aquí.
 */
@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(StopPreference)
    private readonly prefRepo: Repository<StopPreference>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async getByVehicle(vehicleId: string): Promise<UpdatePreferencesDto> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException(`Vehículo ${vehicleId} no encontrado`);

    const allPrefs = await this.prefRepo.find({
      where: { vehicleId },
      order: { priority: 'ASC' },
    });
    
    return {
      vehicleId,
      preferences: allPrefs.filter(p => !p.isExcluded).map(p => ({
        brandName: p.brandName,
        priority: p.priority as number,
        onlyHighway: p.onlyHighway
      })),
      excludedBrands: allPrefs.filter(p => p.isExcluded).map(p => p.brandName),
      notifyGasStationKmBefore: vehicle.notifyGasStationKmBefore ?? 20,
      notifyRestStopHours: vehicle.notifyRestStopHours ?? null,
      maxSpeedLimit: vehicle.maxSpeedLimit ?? 100,
    };
  }

  /**
   * Reemplaza TODAS las preferencias de un vehículo en una transacción.
   * Aplica prioridades y marcas excluidas.
   */
  async updatePreferences(dto: UpdatePreferencesDto): Promise<UpdatePreferencesDto> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: dto.vehicleId } });
    if (!vehicle) throw new NotFoundException(`Vehículo ${dto.vehicleId} no encontrado`);

    // Actualizar settings globales en el vehículo
    if (dto.notifyGasStationKmBefore !== undefined) {
      vehicle.notifyGasStationKmBefore = dto.notifyGasStationKmBefore;
    }
    if (dto.notifyRestStopHours !== undefined) {
      if (dto.notifyRestStopHours === null) {
        vehicle.notifyRestStopHours = null as any; // Typeorm handles null
      } else {
        vehicle.notifyRestStopHours = dto.notifyRestStopHours;
      }
    }
    if (dto.maxSpeedLimit !== undefined) {
      vehicle.maxSpeedLimit = dto.maxSpeedLimit;
    }
    await this.vehicleRepo.save(vehicle);

    // Eliminar todas las preferencias actuales
    await this.prefRepo.delete({ vehicleId: dto.vehicleId });

    const saved: StopPreference[] = [];

    // Guardar preferencias ordenadas
    for (const item of dto.preferences) {
      const pref = this.prefRepo.create({
        vehicleId: dto.vehicleId,
        brandName: item.brandName,
        priority: item.priority,
        onlyHighway: item.onlyHighway ?? false,
        isExcluded: false,
      });
      saved.push(await this.prefRepo.save(pref));
    }

    // Guardar exclusiones
    if (dto.excludedBrands?.length) {
      for (const brand of dto.excludedBrands) {
        const excluded = this.prefRepo.create({
          vehicleId: dto.vehicleId,
          brandName: brand,
          priority: null,
          isExcluded: true,
        });
        await this.prefRepo.save(excluded);
      }
    }

    return this.getByVehicle(dto.vehicleId);
  }

  /**
   * Devuelve las marcas preferidas ordenadas por prioridad (sin excluidas).
   * Usado por PoisService para filtrar estaciones.
   */
  async getOrderedBrands(vehicleId: string): Promise<string[]> {
    const prefs = await this.prefRepo.find({
      where: { vehicleId, isExcluded: false },
      order: { priority: 'ASC' },
    });
    return prefs.map((p) => p.brandName);
  }

  async getExcludedBrands(vehicleId: string): Promise<string[]> {
    const excluded = await this.prefRepo.find({
      where: { vehicleId, isExcluded: true },
    });
    return excluded.map((p) => p.brandName);
  }
}
