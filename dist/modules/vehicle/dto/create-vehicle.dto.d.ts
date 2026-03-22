export declare class CreateVehicleDto {
    licensePlate: string;
    brand: string;
    model: string;
    year?: string;
    fuelCapacityGallons: number;
    avgKmPerGallon: number;
    safetyBuffer?: number;
    currentFuelGallons?: number;
    userId?: string;
}
