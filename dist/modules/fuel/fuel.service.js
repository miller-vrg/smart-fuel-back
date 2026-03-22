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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelService = void 0;
const common_1 = require("@nestjs/common");
const vehicle_not_found_exception_1 = require("../../core/exceptions/vehicle-not-found.exception");
let FuelService = class FuelService {
    constructor(fuelLogRepo, vehicleRepo) {
        this.fuelLogRepo = fuelLogRepo;
        this.vehicleRepo = vehicleRepo;
    }
    async registerFuelLog(dto) {
        const vehicle = await this.findVehicleOrFail(dto.vehicleId);
        const lastLog = await this.fuelLogRepo.findLastLogByVehicleId(dto.vehicleId);
        const kmSinceLastLog = this.calculateKmSinceLastLog(dto.odometer, lastLog?.odometer);
        const kmPerGallon = kmSinceLastLog && dto.gallonsAdded
            ? kmSinceLastLog / dto.gallonsAdded
            : undefined;
        const newLog = this.fuelLogRepo.create({
            ...dto,
            totalCost: dto.gallonsAdded * dto.pricePerGallon,
            kmSinceLastLog,
            kmPerGallon,
        });
        const saved = await this.fuelLogRepo.save(newLog);
        await this.vehicleRepo.updateCurrentFuel(vehicle.id, dto.gallonsAdded);
        return saved;
    }
    async getHistory(vehicleId, limit = 20) {
        await this.findVehicleOrFail(vehicleId);
        return this.fuelLogRepo.findLogsByVehicleIdDesc(vehicleId, limit);
    }
    async calculateRange(vehicleId) {
        const vehicle = await this.findVehicleOrFail(vehicleId);
        const { avgKmPerGallon } = await this.getConsumptionSummary(vehicleId);
        const effectiveKmPerGallon = avgKmPerGallon || Number(vehicle.avgKmPerGallon);
        const grossRangeKm = Number(vehicle.currentFuelGallons) * effectiveKmPerGallon;
        const safetyBuffer = Number(vehicle.safetyBuffer);
        const safeRangeKm = grossRangeKm * (1 - safetyBuffer);
        const fuelLevelPercent = (Number(vehicle.currentFuelGallons) / Number(vehicle.fuelCapacityGallons)) * 100;
        return {
            vehicleId,
            currentFuelGallons: Number(vehicle.currentFuelGallons),
            kmPerGallon: effectiveKmPerGallon,
            grossRangeKm: parseFloat(grossRangeKm.toFixed(1)),
            safetyBufferPercent: safetyBuffer * 100,
            safeRangeKm: parseFloat(safeRangeKm.toFixed(1)),
            fuelLevelPercent: parseFloat(fuelLevelPercent.toFixed(1)),
            status: this.resolveRangeStatus(safeRangeKm),
        };
    }
    async getConsumptionSummary(vehicleId) {
        const logs = await this.fuelLogRepo.findLogsByVehicleIdDesc(vehicleId, 10);
        const logsWithKm = logs.filter((l) => l.kmPerGallon !== null);
        const sampleCount = logsWithKm.length;
        if (sampleCount === 0) {
            const vehicle = await this.findVehicleOrFail(vehicleId);
            return {
                vehicleId,
                avgKmPerGallon: Number(vehicle.avgKmPerGallon),
                lastKmPerGallon: null,
                trend: 'STABLE',
                sampleCount: 0,
                hasAnomaly: false,
                deviationPercent: null,
            };
        }
        const avg = logsWithKm.reduce((sum, l) => sum + Number(l.kmPerGallon), 0) / sampleCount;
        const lastKmPerGallon = Number(logsWithKm[0].kmPerGallon);
        const deviation = Math.abs(lastKmPerGallon - avg) / avg;
        const hasAnomaly = deviation > 0.15;
        return {
            vehicleId,
            avgKmPerGallon: parseFloat(avg.toFixed(2)),
            lastKmPerGallon: parseFloat(lastKmPerGallon.toFixed(2)),
            trend: this.resolveTrend(lastKmPerGallon, avg),
            sampleCount,
            hasAnomaly,
            deviationPercent: hasAnomaly ? parseFloat((deviation * 100).toFixed(1)) : null,
        };
    }
    async findVehicleOrFail(vehicleId) {
        const vehicle = await this.vehicleRepo.findById(vehicleId);
        if (!vehicle)
            throw new vehicle_not_found_exception_1.VehicleNotFoundException(vehicleId);
        return vehicle;
    }
    calculateKmSinceLastLog(currentOdometer, lastOdometer) {
        if (!currentOdometer || !lastOdometer)
            return undefined;
        const km = currentOdometer - lastOdometer;
        return km > 0 ? km : undefined;
    }
    resolveRangeStatus(safeRangeKm) {
        if (safeRangeKm > 100)
            return 'SAFE';
        if (safeRangeKm > 40)
            return 'WARNING';
        return 'CRITICAL';
    }
    resolveTrend(last, avg) {
        const diff = ((last - avg) / avg) * 100;
        if (diff > 3)
            return 'UP';
        if (diff < -3)
            return 'DOWN';
        return 'STABLE';
    }
};
exports.FuelService = FuelService;
exports.FuelService = FuelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IFuelLogRepository')),
    __param(1, (0, common_1.Inject)('IVehicleRepository')),
    __metadata("design:paramtypes", [Object, Object])
], FuelService);
//# sourceMappingURL=fuel.service.js.map