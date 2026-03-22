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
exports.FuelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fuel_service_1 = require("./fuel.service");
const create_fuel_log_dto_1 = require("./dto/create-fuel-log.dto");
const fuel_log_entity_1 = require("../../core/entities/fuel-log.entity");
let FuelController = class FuelController {
    constructor(fuelService) {
        this.fuelService = fuelService;
    }
    registerFuelLog(dto) {
        return this.fuelService.registerFuelLog(dto);
    }
    getHistory(vehicleId, limit) {
        return this.fuelService.getHistory(vehicleId, limit);
    }
    calculateRange(vehicleId) {
        return this.fuelService.calculateRange(vehicleId);
    }
    getConsumptionSummary(vehicleId) {
        return this.fuelService.getConsumptionSummary(vehicleId);
    }
};
exports.FuelController = FuelController;
__decorate([
    (0, common_1.Post)('log'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo tanqueo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tanqueo registrado exitosamente', type: fuel_log_entity_1.FuelLog }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fuel_log_dto_1.CreateFuelLogDto]),
    __metadata("design:returntype", void 0)
], FuelController.prototype, "registerFuelLog", null);
__decorate([
    (0, common_1.Get)('history/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de tanqueos por vehículo' }),
    (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'N° de registros (default: 20)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de registros de tanqueos.', type: [fuel_log_entity_1.FuelLog] }),
    __param(0, (0, common_1.Param)('vehicleId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], FuelController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('range/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular autonomía actual con buffer de seguridad' }),
    (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Retorna safeRangeKm, fuelLevelPercent y status (SAFE|WARNING|CRITICAL)',
    }),
    __param(0, (0, common_1.Param)('vehicleId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuelController.prototype, "calculateRange", null);
__decorate([
    (0, common_1.Get)('consumption/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen de consumo y detección de anomalías' }),
    (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resumen de consumo promedio y rendimiento.' }),
    __param(0, (0, common_1.Param)('vehicleId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FuelController.prototype, "getConsumptionSummary", null);
exports.FuelController = FuelController = __decorate([
    (0, swagger_1.ApiTags)('fuel'),
    (0, common_1.Controller)('fuel'),
    __metadata("design:paramtypes", [fuel_service_1.FuelService])
], FuelController);
//# sourceMappingURL=fuel.controller.js.map