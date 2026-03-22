"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const anomaly_detector_service_1 = require("./anomaly-detector.service");
describe('AnomalyDetectorService', () => {
    let service;
    const mockConfigService = {
        get: jest.fn().mockReturnValue(0.15),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                anomaly_detector_service_1.AnomalyDetectorService,
                { provide: config_1.ConfigService, useValue: mockConfigService },
            ],
        }).compile();
        service = module.get(anomaly_detector_service_1.AnomalyDetectorService);
    });
    describe('analyze', () => {
        it('debe detectar HIGH_CONSUMPTION cuando consumo cae más del 15%', () => {
            const result = service.analyze('vehicle-1', 8, 10);
            expect(result.hasAnomaly).toBe(true);
            expect(result.direction).toBe('HIGH_CONSUMPTION');
            expect(result.deviationPercent).toBe(20);
        });
        it('debe detectar LOW_CONSUMPTION cuando eficiencia mejora más del 15%', () => {
            const result = service.analyze('vehicle-1', 12, 10);
            expect(result.hasAnomaly).toBe(true);
            expect(result.direction).toBe('LOW_CONSUMPTION');
            expect(result.deviationPercent).toBe(20);
        });
        it('debe retornar NORMAL cuando desviación es exactamente 15%', () => {
            const result = service.analyze('vehicle-1', 8.5, 10);
            expect(result.hasAnomaly).toBe(false);
            expect(result.direction).toBe('NORMAL');
        });
        it('debe retornar sin anomalía cuando no hay historial (avg = 0)', () => {
            const result = service.analyze('vehicle-1', 10, 0);
            expect(result.hasAnomaly).toBe(false);
            expect(result.message).toContain('Sin historial');
        });
        it('debe incluir el vehicleId en el resultado', () => {
            const result = service.analyze('my-vehicle-id', 10, 10);
            expect(result.vehicleId).toBe('my-vehicle-id');
        });
        it('debe redondear deviationPercent a 1 decimal', () => {
            const result = service.analyze('v1', 7, 10);
            expect(result.deviationPercent).toBe(30);
        });
    });
});
//# sourceMappingURL=anomaly-detector.service.spec.js.map