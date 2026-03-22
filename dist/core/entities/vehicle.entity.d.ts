import { User } from './user.entity';
import { FuelLog } from './fuel-log.entity';
import { StopPreference } from './stop-preference.entity';
export declare class Vehicle {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: string;
    fuelCapacityGallons: number;
    avgKmPerGallon: number;
    currentFuelGallons: number;
    safetyBuffer: number;
    userId: string;
    user: User;
    fuelLogs: FuelLog[];
    stopPreferences: StopPreference[];
    notifyGasStationKmBefore: number;
    notifyRestStopHours: number;
    activeTrip: any;
    createdAt: Date;
    updatedAt: Date;
}
