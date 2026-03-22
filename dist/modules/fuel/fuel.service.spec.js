"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const fuel_service_1 = require("./fuel.service");
const vehicle_not_found_exception_1 = require("../../core/exceptions/vehicle-not-found.exception");
const mockVehicle = () => ({
    id: 'vehicle-uuid-1',
    licensePlate: 'ABC-123',
    brand: 'Toyota',
    model: 'Hilux',
    fuelCapacityGallons: 15,
    avgKmPerGallon: 10,
    currentFuelGallons: 10,
    safetyBuffer: 0.15,
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
    let service;
    let fuelLogRepo;
    let vehicleRepo;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                fuel_service_1.FuelService,
                { provide: 'IFuelLogRepository', useFactory: mockFuelLogRepo },
                { provide: 'IVehicleRepository', useFactory: mockVehicleRepo },
            ],
        }).compile();
        service = module.get(fuel_service_1.FuelService);
        fuelLogRepo = module.get('IFuelLogRepository');
        vehicleRepo = module.get('IVehicleRepository');
    });
    describe('calculateRange', () => {
        it('debe calcular autonomía real aplicando buffer de 15%', async () => {
            vehicleRepo.findById.mockResolvedValue(mockVehicle());
            fuelLogRepo.findLogsByVehicleIdDesc.mockResolvedValue([]);
            const result = await service.calculateRange('vehicle-uuid-1');
            expect(result.grossRangeKm).toBe(100);
            expect(result.safeRangeKm).toBe(85);
            expect(result.safetyBufferPercent).toBe(15);
            expect(result.fuelLevelPercent).toBe(66.7);
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
            expect(result.status).toBe('CRITICAL');
        });
        it('debe lanzar VehicleNotFoundException si vehículo no existe', async () => {
            vehicleRepo.findById.mockResolvedValue(null);
            await expect(service.calculateRange('non-existent-id')).rejects.toThrow(vehicle_not_found_exception_1.VehicleNotFoundException);
        });
    });
    describe('registerFuelLog', () => {
        it('debe calcular kmPerGallon correctamente cuando hay odómetro previo', async () => {
            vehicleRepo.findById.mockResolvedValue(mockVehicle());
            vehicleRepo.updateCurrentFuel.mockResolvedValue(undefined);
            fuelLogRepo.findLastLogByVehicleId.mockResolvedValue({ odometer: 80000 });
            fuelLogRepo.create.mockImplementation((data) => data);
            fuelLogRepo.save.mockImplementation((data) => Promise.resolve({ id: 'log-1', ...data }));
            const dto = {
                vehicleId: 'vehicle-uuid-1',
                gallonsAdded: 10,
                pricePerGallon: 15000,
                odometer: 80100,
            };
            const result = await service.registerFuelLog(dto);
            expect(fuelLogRepo.create).toHaveBeenCalledWith(expect.objectContaining({ kmSinceLastLog: 100, kmPerGallon: 10 }));
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
            });
            expect(fuelLogRepo.create).toHaveBeenCalledWith(expect.objectContaining({ totalCost: 150000 }));
        });
    });
    describe('getConsumptionSummary', () => {
        it('debe detectar anomalía cuando desviación > 15%', async () => {
            vehicleRepo.findById.mockResolvedValue(mockVehicle());
            fuelLogRepo.findLogsByVehicleIdDesc.mockResolvedValue([
                { kmPerGallon: 6 },
                { kmPerGallon: 10 },
                { kmPerGallon: 10 },
                { kmPerGallon: 10 },
            ]);
            const result = await service.getConsumptionSummary('vehicle-uuid-1');
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
//# sourceMappingURL=fuel.service.spec.js.map