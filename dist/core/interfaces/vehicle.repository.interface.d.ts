import { Vehicle } from '../entities/vehicle.entity';
export interface IVehicleRepository {
    findById(id: string): Promise<Vehicle | null>;
    updateCurrentFuel(id: string, currentFuelGallons: number): Promise<void>;
}
