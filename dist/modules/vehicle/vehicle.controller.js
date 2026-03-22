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
exports.VehicleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vehicle_service_1 = require("./vehicle.service");
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const vehicle_entity_1 = require("../../core/entities/vehicle.entity");
let VehicleController = class VehicleController {
    constructor(vehicleService) {
        this.vehicleService = vehicleService;
    }
    create(dto) {
        return this.vehicleService.create(dto);
    }
    findAll() {
        return this.vehicleService.findAll();
    }
    findOne(id) {
        return this.vehicleService.findOne(id);
    }
    updateFuelLevel(id, gallons) {
        return this.vehicleService.updateFuelLevel(id, gallons);
    }
    updateSafetyBuffer(id, buffer) {
        return this.vehicleService.updateSafetyBuffer(id, buffer);
    }
    updateActiveTrip(id, body) {
        return this.vehicleService.updateActiveTrip(id, body);
    }
    remove(id) {
        return this.vehicleService.remove(id);
    }
};
exports.VehicleController = VehicleController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar nuevo vehículo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'El vehículo ha sido creado exitosamente.', type: vehicle_entity_1.Vehicle }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los vehículos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de vehículos obtenida.', type: [vehicle_entity_1.Vehicle] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un vehículo por su ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehículo encontrado.', type: vehicle_entity_1.Vehicle }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehículo no encontrado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/fuel-level'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar nivel de combustible en galones' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiQuery)({ name: 'gallons', type: Number, description: 'Nivel actual de gasolina en galones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Nivel de combustible actualizado exitosamente.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('gallons')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "updateFuelLevel", null);
__decorate([
    (0, common_1.Patch)(':id/safety-buffer'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar buffer de seguridad (0.10 - 0.25)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiQuery)({ name: 'buffer', type: Number, description: 'Nuevo buffer de seguridad' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Buffer de seguridad actualizado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('buffer')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "updateSafetyBuffer", null);
__decorate([
    (0, common_1.Patch)(':id/active-trip'),
    (0, swagger_1.ApiOperation)({ summary: 'Guardar el estado de la ruta activa' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ruta guardada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "updateActiveTrip", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un vehículo' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID del vehículo a eliminar' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Vehículo eliminado con éxito.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehicleController.prototype, "remove", null);
exports.VehicleController = VehicleController = __decorate([
    (0, swagger_1.ApiTags)('vehicles'),
    (0, common_1.Controller)('vehicles'),
    __metadata("design:paramtypes", [vehicle_service_1.VehicleService])
], VehicleController);
//# sourceMappingURL=vehicle.controller.js.map