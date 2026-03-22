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
var AnomalyDetectorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnomalyDetectorService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AnomalyDetectorService = AnomalyDetectorService_1 = class AnomalyDetectorService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AnomalyDetectorService_1.name);
        this.threshold = this.configService.get('app.anomalyThreshold') ?? 0.15;
    }
    analyze(vehicleId, currentKmPerGallon, historicAvgKmPerGallon) {
        if (historicAvgKmPerGallon <= 0) {
            return this.noAnomaly(vehicleId, currentKmPerGallon, historicAvgKmPerGallon);
        }
        const deviation = (currentKmPerGallon - historicAvgKmPerGallon) / historicAvgKmPerGallon;
        const absDeviation = Math.abs(deviation);
        const hasAnomaly = absDeviation > this.threshold;
        const direction = !hasAnomaly
            ? 'NORMAL'
            : deviation < 0
                ? 'HIGH_CONSUMPTION'
                : 'LOW_CONSUMPTION';
        const message = this.buildMessage(direction, absDeviation * 100, currentKmPerGallon);
        if (hasAnomaly) {
            this.logger.warn(`Anomalía detectada en vehículo ${vehicleId}: ${message} (${(absDeviation * 100).toFixed(1)}% desviación)`);
        }
        return {
            vehicleId,
            hasAnomaly,
            currentKmPerGallon: parseFloat(currentKmPerGallon.toFixed(2)),
            historicAvgKmPerGallon: parseFloat(historicAvgKmPerGallon.toFixed(2)),
            deviationPercent: parseFloat((absDeviation * 100).toFixed(1)),
            direction,
            message,
        };
    }
    buildMessage(direction, deviationPct, current) {
        if (direction === 'NORMAL')
            return 'Consumo dentro del rango normal';
        if (direction === 'HIGH_CONSUMPTION') {
            return `⚠️ Consumo elevado: ${current.toFixed(1)} Km/L (${deviationPct.toFixed(0)}% mayor al promedio). Posible fallo mecánico o carga excesiva.`;
        }
        return `📈 Eficiencia mejorada: ${current.toFixed(1)} Km/L (${deviationPct.toFixed(0)}% mejor al promedio).`;
    }
    noAnomaly(vehicleId, current, historic) {
        return {
            vehicleId,
            hasAnomaly: false,
            currentKmPerGallon: current,
            historicAvgKmPerGallon: historic,
            deviationPercent: 0,
            direction: 'NORMAL',
            message: 'Sin historial suficiente para comparar',
        };
    }
};
exports.AnomalyDetectorService = AnomalyDetectorService;
exports.AnomalyDetectorService = AnomalyDetectorService = AnomalyDetectorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AnomalyDetectorService);
//# sourceMappingURL=anomaly-detector.service.js.map