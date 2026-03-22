import { FuelService } from '@modules/fuel/fuel.service';
import { AnomalyDetectorService } from './anomaly-detector.service';
import { AlertsGateway } from '@modules/alerts/alerts.gateway';
export declare class AnalyticsService {
    private readonly fuelService;
    private readonly anomalyDetector;
    private readonly alertsGateway;
    private readonly logger;
    constructor(fuelService: FuelService, anomalyDetector: AnomalyDetectorService, alertsGateway: AlertsGateway);
    analyzeVehicleConsumption(vehicleId: string): Promise<{
        message: string;
        vehicleId: string;
        consumption?: undefined;
        anomaly?: undefined;
    } | {
        consumption: import("../fuel/dto/fuel-consumption.dto").ConsumptionSummaryDto;
        anomaly: import("./anomaly-detector.service").AnomalyResult;
        message?: undefined;
        vehicleId?: undefined;
    }>;
}
