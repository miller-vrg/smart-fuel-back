import { Test, TestingModule } from '@nestjs/testing';
import { FuelService } from './fuel.service';
import { FuelLog } from '@core/entities/fuel-log.entity';
import { Vehicle } from '@core/entities/vehicle.entity';
import { VehicleNotFoundException } from '../../core/exceptions/vehicle-not-found.exception';

const mockVehicle = (): Partial<Vehicle> => ({
  id: 'vehicle-uuid-1',
  licensePlate: 'ABC-123',
  brand: 'Toyota',
  model: 'Hilux',
  fuelCapacityGallons: 15 as any,
  avgKmPerGallon: 10 as any,
  currentFuelGallons: 10 as any,
  safetyBuffer: 0.15 as any,
});

const mockFuelLogRepo = () => ({
  findLastLogByVehicleId: jest.fn(),
  findLogsByVehicleIdDesc: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockVehicleRepo = () => ({
  findById: jest.fn(),
  updateCurrentFuel: jest.fn(),
});

describe('FuelService', () => {
  let service: FuelService;
  let fuelLogRepo: ReturnType<typeof mockFuelLogRepo>;
  let vehicleRepo: ReturnType<typeof mockVehicleRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelService,
        { provide: 'IFuelLogRepository', useFactory: mockFuelLogRepo },
        { provide: 'IVehicleRepository', useFactory: mockVehicleRepo },
      ],
    }).compile();

    service = module.get<FuelService>(FuelService);
    fuelLogRepo = module.get('IFuelLogRepository');
    vehicleRepo = module.get('IVehicleRepository');
  });

  // ── calculateRange ─────────────────────────────────────────────────

  describe('calculateRange', () => {
    it('debe calcular autonomía real aplicando buffer de 15%', async () => {
      vehicleRepo.findById.mockResolvedValue(mockVehicle());
      fuelLogRepo.findLogsByVehicleIdDesc.mockResolvedValue([]); // sin historial

      const result = await service.calculateRange('vehicle-uuid-1');

      // 10 galones × 10 Km/gal = 100 Km brutos
      // Con buffer 15%: 100 × (1 - 0.15) = 85 Km
      expect(result.grossRangeKm).toBe(100);
      expect(result.safeRangeKm).toBe(85);
      expect(result.safetyBufferPercent).toBe(15);
      expect(result.fuelLevelPercent).toBe(66.7); // 10/15
      expect(result.status).toBe('SAFE');
    });

    it('debe retornar CRITICAL cuando autonomía < 40 Km', async () => {
      vehicleRepo.findById.mockResolvedValue({
        ...mockVehicle(),
        currentFuelGallons: 2,
        avgKmPerGallon: 10,
        safetyBuffer: 0.15,
        fuelCapacityGallons: 15,
      });
      fuelLogRepo.findLogsByVehicleIdDesc.mockResolvedValue([]);

      const result = await service.calculateRange('vehicle-uuid-1');
      // 2 × 10 = 20 × 0.85 = 17 Km → CRITICAL
      expect(result.status).toBe('CRITICAL');
    });

    it('debe lanzar VehicleNotFoundException si vehículo no existe', async () => {
      vehicleRepo.findById.mockResolvedValue(null);
      await expect(service.calculateRange('non-existent-id')).rejects.toThrow(
        VehicleNotFoundException,
      );
    });
  });

  // ── registerFuelLog ────────────────────────────────────────────────

  describe('registerFuelLog', () => {
    it('debe calcular kmPerGallon correctamente cuando hay odómetro previo', async () => {
      vehicleRepo.findById.mockResolvedValue(mockVehicle());
      vehicleRepo.updateCurrentFuel.mockResolvedValue(undefined);
      fuelLogRepo.findLastLogByVehicleId.mockResolvedValue({ odometer: 80000 }); // último tanqueo
      fuelLogRepo.create.mockImplementation((data) => data);
      fuelLogRepo.save.mockImplementation((data) => Promise.resolve({ id: 'log-1', ...data }));

      const dto = {
        vehicleId: 'vehicle-uuid-1',
        gallonsAdded: 10,
        pricePerGallon: 15000,
        odometer: 80100, // recorrió 100 Km
      };

      const result = await service.registerFuelLog(dto as any);

      // 100 Km / 10 galones = 10 Km/galón
      expect(fuelLogRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ kmSinceLastLog: 100, kmPerGallon: 10 }),
      );
    });

    it('debe calcular costo total correctamente', async () => {
      vehicleRepo.findById.mockResolvedValue(mockVehicle());
      vehicleRepo.updateCurrentFuel.mockResolvedValue(undefined);
      fuelLogRepo.findLastLogByVehicleId.mockResolvedValue(null);
      fuelLogRepo.create.mockImplementation((data) => data);
      fuelLogRepo.save.mockImplementation((data) => Promise.resolve({ id: 'log-1', ...data }));

      await service.registerFuelLog({
        vehicleId: 'vehicle-uuid-1',
        gallonsAdded: 10,
        pricePerGallon: 15000,
      } as any);

      expect(fuelLogRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ totalCost: 150000 }),
      );
    });
  });

  // ── getConsumptionSummary ──────────────────────────────────────────

  describe('getConsumptionSummary', () => {
    it('debe detectar anomalía cuando desviación > 15%', async () => {
      vehicleRepo.findById.mockResolvedValue(mockVehicle());
      fuelLogRepo.findLogsByVehicleIdDesc.mockResolvedValue([
        { kmPerGallon: 6 },    // último (consumo muy alto)
        { kmPerGallon: 10 },
        { kmPerGallon: 10 },
        { kmPerGallon: 10 },
      ]);

      const result = await service.getConsumptionSummary('vehicle-uuid-1');

      // promedio ≈ 9, último = 6 → desviación ≈ 33% > 15%
      expect(result.hasAnomaly).toBe(true);
      expect(result.deviationPercent).toBeGreaterThan(15);
    });

    it('debe retornar STABLE cuando consumo es consistente', async () => {
      vehicleRepo.findById.mockResolvedValue(mockVehicle());
      fuelLogRepo.findLogsByVehicleIdDesc.mockResolvedValue([
        { kmPerGallon: 10.1 },
        { kmPerGallon: 9.9 },
        { kmPerGallon: 10.0 },
      ]);

      const result = await service.getConsumptionSummary('vehicle-uuid-1');

      expect(result.trend).toBe('STABLE');
      expect(result.hasAnomaly).toBe(false);
    });
  });
});
