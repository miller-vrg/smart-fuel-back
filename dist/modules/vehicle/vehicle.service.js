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
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("../../core/entities/vehicle.entity");
let VehicleService = class VehicleService {
    constructor(vehicleRepo) {
        this.vehicleRepo = vehicleRepo;
    }
    async create(dto) {
        const existing = await this.vehicleRepo.findOne({ where: { licensePlate: dto.licensePlate } });
        if (existing) {
            throw new common_1.ConflictException(`Ya existe un vehículo con placa ${dto.licensePlate}`);
        }
        const vehicle = this.vehicleRepo.create({
            ...dto,
            currentFuelGallons: dto.currentFuelGallons ?? 0,
            safetyBuffer: dto.safetyBuffer ?? 0.15,
        });
        return this.vehicleRepo.save(vehicle);
    }
    async findAll() {
        return this.vehicleRepo.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const vehicle = await this.vehicleRepo.findOne({ where: { id } });
        if (!vehicle)
            throw new common_1.NotFoundException(`Vehículo ${id} no encontrado`);
        return vehicle;
    }
    async updateFuelLevel(vehicleId, gallons) {
        const vehicle = await this.findOne(vehicleId);
        vehicle.currentFuelGallons = gallons;
        return this.vehicleRepo.save(vehicle);
    }
    async updateSafetyBuffer(vehicleId, buffer) {
        const vehicle = await this.findOne(vehicleId);
        vehicle.safetyBuffer = buffer;
        return this.vehicleRepo.save(vehicle);
    }
    async updateActiveTrip(vehicleId, activeTrip) {
        const vehicle = await this.findOne(vehicleId);
        vehicle.activeTrip = activeTrip;
        return this.vehicleRepo.save(vehicle);
    }
    async remove(id) {
        const vehicle = await this.findOne(id);
        await this.vehicleRepo.remove(vehicle);
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehicleService);
//# sourceMappingURL=vehicle.service.js.map