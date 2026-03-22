import { Injectable, Logger } from '@nestjs/common';
import { FuelService } from '@modules/fuel/fuel.service';
import { AnomalyDetectorService } from './anomaly-detector.service';
import { AlertsGateway } from '@modules/alerts/alerts.gateway';

/**
 * AnalyticsService – Orquesta el análisis de consumo:
 * 1. Obtiene el resumen de consumo del vehículo
 * 2. Delega la detección al AnomalyDetectorService
 * 3. Si hay anomalía, notifica via WebSocket al frontend
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly fuelService: FuelService,
    private readonly anomalyDetector: AnomalyDetectorService,
    private readonly alertsGateway: AlertsGateway,
  ) {}

  async analyzeVehicleConsumption(vehicleId: string) {
    const summary = await this.fuelService.getConsumptionSummary(vehicleId);

    if (!summary.lastKmPerGallon) {
      return { message: 'Sin suficientes datos para analizar', vehicleId };
    }

    const result = this.anomalyDetector.analyze(
      vehicleId,
      summary.lastKmPerGallon,
      summary.avgKmPerGallon,
    );

    if (result.hasAnomaly) {
      this.alertsGateway.sendAnomalyAlert(vehicleId, result);
    }

    return { consumption: summary, anomaly: result };
  }
}
