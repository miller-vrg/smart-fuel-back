import { FuelLog } from '@core/entities/fuel-log.entity';
export interface IFuelRepository {
    save(log: Partial<FuelLog>): Promise<FuelLog>;
    findByVehicleId(vehicleId: string, limit?: number): Promise<FuelLog[]>;
    findLastByVehicleId(vehicleId: string): Promise<FuelLog | null>;
}
export declare const FUEL_REPOSITORY = "FUEL_REPOSITORY";
