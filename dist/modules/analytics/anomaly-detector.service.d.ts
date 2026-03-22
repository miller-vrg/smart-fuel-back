import { ConfigService } from '@nestjs/config';
export interface AnomalyResult {
    vehicleId: string;
    hasAnomaly: boolean;
    currentKmPerGallon: number;
    historicAvgKmPerGallon: number;
    deviationPercent: number;
    direction: 'HIGH_CONSUMPTION' | 'LOW_CONSUMPTION' | 'NORMAL';
    message: string;
}
export declare class AnomalyDetectorService {
    private readonly configService;
    private readonly logger;
    private readonly threshold;
    constructor(configService: ConfigService);
    analyze(vehicleId: string, currentKmPerGallon: number, historicAvgKmPerGallon: number): AnomalyResult;
    private buildMessage;
    private noAnomaly;
}
