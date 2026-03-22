"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const fuel_service_1 = require("../fuel/fuel.service");
const anomaly_detector_service_1 = require("./anomaly-detector.service");
const alerts_gateway_1 = require("../alerts/alerts.gateway");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(fuelService, anomalyDetector, alertsGateway) {
        this.fuelService = fuelService;
        this.anomalyDetector = anomalyDetector;
        this.alertsGateway = alertsGateway;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async analyzeVehicleConsumption(vehicleId) {
        const summary = await this.fuelService.getConsumptionSummary(vehicleId);
        if (!summary.lastKmPerGallon) {
            return { message: 'Sin suficientes datos para analizar', vehicleId };
        }
        const result = this.anomalyDetector.analyze(vehicleId, summary.lastKmPerGallon, summary.avgKmPerGallon);
        if (result.hasAnomaly) {
            this.alertsGateway.sendAnomalyAlert(vehicleId, result);
        }
        return { consumption: summary, anomaly: result };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [fuel_service_1.FuelService,
        anomaly_detector_service_1.AnomalyDetectorService,
        alerts_gateway_1.AlertsGateway])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map