import { Vehicle } from './vehicle.entity';
export declare class StopPreference {
    id: string;
    vehicleId: string;
    vehicle: Vehicle;
    brandName: string;
    priority: number | null;
    onlyHighway: boolean;
    isExcluded: boolean;
    createdAt: Date;
}
