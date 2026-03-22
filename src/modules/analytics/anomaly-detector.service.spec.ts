import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AnomalyDetectorService } from './anomaly-detector.service';

describe('AnomalyDetectorService', () => {
  let service: AnomalyDetectorService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue(0.15), // threshold 15%
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnomalyDetectorService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AnomalyDetectorService>(AnomalyDetectorService);
  });

  describe('analyze', () => {
    it('debe detectar HIGH_CONSUMPTION cuando consumo cae más del 15%', () => {
      // Histórico: 10 Km/L, Actual: 8 Km/L → desviación 20%
      const result = service.analyze('vehicle-1', 8, 10);

      expect(result.hasAnomaly).toBe(true);
      expect(result.direction).toBe('HIGH_CONSUMPTION');
      expect(result.deviationPercent).toBe(20);
    });

    it('debe detectar LOW_CONSUMPTION cuando eficiencia mejora más del 15%', () => {
      // Histórico: 10 Km/L, Actual: 12 Km/L → desviación 20%
      const result = service.analyze('vehicle-1', 12, 10);

      expect(result.hasAnomaly).toBe(true);
      expect(result.direction).toBe('LOW_CONSUMPTION');
      expect(result.deviationPercent).toBe(20);
    });

    it('debe retornar NORMAL cuando desviación es exactamente 15%', () => {
      // Exactamente en el umbral no debe disparar anomalía
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
      // 10 → 7 = 30% exacto
      const result = service.analyze('v1', 7, 10);
      expect(result.deviationPercent).toBe(30);
    });
  });
});
