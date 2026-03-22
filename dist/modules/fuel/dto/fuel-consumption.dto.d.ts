export declare class RangeCalculationDto {
    vehicleId: string;
    currentFuelGallons: number;
    kmPerGallon: number;
    grossRangeKm: number;
    safetyBufferPercent: number;
    safeRangeKm: number;
    fuelLevelPercent: number;
    status: 'SAFE' | 'WARNING' | 'CRITICAL';
}
export declare class ConsumptionSummaryDto {
    vehicleId: string;
    avgKmPerGallon: number;
    lastKmPerGallon: number | null;
    trend: 'UP' | 'DOWN' | 'STABLE';
    sampleCount: number;
    hasAnomaly: boolean;
    deviationPercent: number | null;
}
