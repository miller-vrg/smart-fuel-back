import { Vehicle } from './vehicle.entity';
export declare class FuelLog {
    id: string;
    vehicleId: string;
    vehicle: Vehicle;
    gallonsAdded: number;
    pricePerGallon: number;
    totalCost: number;
    odometer: number;
    kmSinceLastLog: number;
    kmPerGallon: number;
    stationName: string;
    stationBrand: string;
    latitude: number;
    longitude: number;
    notes: string;
    loggedAt: Date;
}
