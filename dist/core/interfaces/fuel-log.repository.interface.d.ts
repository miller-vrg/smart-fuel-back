import { FuelLog } from '../entities/fuel-log.entity';
export interface IFuelLogRepository {
    create(fuelLog: Partial<FuelLog>): FuelLog;
    save(fuelLog: FuelLog): Promise<FuelLog>;
    findLogsByVehicleIdDesc(vehicleId: string, take?: number): Promise<FuelLog[]>;
    findLastLogByVehicleId(vehicleId: string): Promise<FuelLog | null>;
}
