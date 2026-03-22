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
exports.PreferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stop_preference_entity_1 = require("../../core/entities/stop-preference.entity");
const vehicle_entity_1 = require("../../core/entities/vehicle.entity");
let PreferencesService = class PreferencesService {
    constructor(prefRepo, vehicleRepo) {
        this.prefRepo = prefRepo;
        this.vehicleRepo = vehicleRepo;
    }
    async getByVehicle(vehicleId) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id: vehicleId } });
        if (!vehicle)
            throw new common_1.NotFoundException(`Vehículo ${vehicleId} no encontrado`);
        const allPrefs = await this.prefRepo.find({
            where: { vehicleId },
            order: { priority: 'ASC' },
        });
        return {
            vehicleId,
            preferences: allPrefs.filter(p => !p.isExcluded).map(p => ({
                brandName: p.brandName,
                priority: p.priority,
                onlyHighway: p.onlyHighway
            })),
            excludedBrands: allPrefs.filter(p => p.isExcluded).map(p => p.brandName),
            notifyGasStationKmBefore: vehicle.notifyGasStationKmBefore ?? 20,
            notifyRestStopHours: vehicle.notifyRestStopHours ?? null,
        };
    }
    async updatePreferences(dto) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id: dto.vehicleId } });
        if (!vehicle)
            throw new common_1.NotFoundException(`Vehículo ${dto.vehicleId} no encontrado`);
        if (dto.notifyGasStationKmBefore !== undefined) {
            vehicle.notifyGasStationKmBefore = dto.notifyGasStationKmBefore;
        }
        if (dto.notifyRestStopHours !== undefined) {
            if (dto.notifyRestStopHours === null) {
                vehicle.notifyRestStopHours = null;
            }
            else {
                vehicle.notifyRestStopHours = dto.notifyRestStopHours;
            }
        }
        await this.vehicleRepo.save(vehicle);
        await this.prefRepo.delete({ vehicleId: dto.vehicleId });
        const saved = [];
        for (const item of dto.preferences) {
            const pref = this.prefRepo.create({
                vehicleId: dto.vehicleId,
                brandName: item.brandName,
                priority: item.priority,
                onlyHighway: item.onlyHighway ?? false,
                isExcluded: false,
            });
            saved.push(await this.prefRepo.save(pref));
        }
        if (dto.excludedBrands?.length) {
            for (const brand of dto.excludedBrands) {
                const excluded = this.prefRepo.create({
                    vehicleId: dto.vehicleId,
                    brandName: brand,
                    priority: null,
                    isExcluded: true,
                });
                await this.prefRepo.save(excluded);
            }
        }
        return this.getByVehicle(dto.vehicleId);
    }
    async getOrderedBrands(vehicleId) {
        const prefs = await this.prefRepo.find({
            where: { vehicleId, isExcluded: false },
            order: { priority: 'ASC' },
        });
        return prefs.map((p) => p.brandName);
    }
    async getExcludedBrands(vehicleId) {
        const excluded = await this.prefRepo.find({
            where: { vehicleId, isExcluded: true },
        });
        return excluded.map((p) => p.brandName);
    }
};
exports.PreferencesService = PreferencesService;
exports.PreferencesService = PreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stop_preference_entity_1.StopPreference)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PreferencesService);
//# sourceMappingURL=preferences.service.js.map