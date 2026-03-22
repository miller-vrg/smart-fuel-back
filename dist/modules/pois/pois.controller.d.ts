import { PoisService } from './pois.service';
export declare class PoisController {
    private readonly poisService;
    constructor(poisService: PoisService);
    findNearestByPreference(lat: number, lon: number, vehicleId: string, rangeKm: number): Promise<import("./pois.service").PrioritizedPOI[]>;
}
