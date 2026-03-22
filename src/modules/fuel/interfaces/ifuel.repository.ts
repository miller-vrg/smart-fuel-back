import { FuelLog } from '@core/entities/fuel-log.entity';
import { CreateFuelLogDto } from '../dto/create-fuel-log.dto';

/**
 * IFuelRepository (DIP - Dependency Inversion Principle)
 * El servicio depende de esta abstracción, no de TypeORM directamente.
 */
export interface IFuelRepository {
  save(log: Partial<FuelLog>): Promise<FuelLog>;
  findByVehicleId(vehicleId: string, limit?: number): Promise<FuelLog[]>;
  findLastByVehicleId(vehicleId: string): Promise<FuelLog | null>;
}

export const FUEL_REPOSITORY = 'FUEL_REPOSITORY';
