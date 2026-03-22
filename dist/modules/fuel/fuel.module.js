"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fuel_log_entity_1 = require("../../core/entities/fuel-log.entity");
const vehicle_entity_1 = require("../../core/entities/vehicle.entity");
const fuel_service_1 = require("./fuel.service");
const fuel_controller_1 = require("./fuel.controller");
const fuel_log_repository_1 = require("../../infrastructure/database/repositories/fuel-log.repository");
const vehicle_repository_1 = require("../../infrastructure/database/repositories/vehicle.repository");
let FuelModule = class FuelModule {
};
exports.FuelModule = FuelModule;
exports.FuelModule = FuelModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fuel_log_entity_1.FuelLog, vehicle_entity_1.Vehicle])],
        controllers: [fuel_controller_1.FuelController],
        providers: [
            fuel_service_1.FuelService,
            { provide: 'IFuelLogRepository', useClass: fuel_log_repository_1.FuelLogRepository },
            { provide: 'IVehicleRepository', useClass: vehicle_repository_1.VehicleRepository }
        ],
        exports: [fuel_service_1.FuelService],
    })
], FuelModule);
//# sourceMappingURL=fuel.module.js.map