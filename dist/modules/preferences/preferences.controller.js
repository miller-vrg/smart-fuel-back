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
exports.PreferencesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const preferences_service_1 = require("./preferences.service");
const update_preferences_dto_1 = require("./dto/update-preferences.dto");
let PreferencesController = class PreferencesController {
    constructor(preferencesService) {
        this.preferencesService = preferencesService;
    }
    getByVehicle(vehicleId) {
        return this.preferencesService.getByVehicle(vehicleId);
    }
    updatePreferences(dto) {
        return this.preferencesService.updatePreferences(dto);
    }
};
exports.PreferencesController = PreferencesController;
__decorate([
    (0, common_1.Get)(':vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener preferencias de parada por vehículo' }),
    (0, swagger_1.ApiParam)({ name: 'vehicleId', description: 'UUID del vehículo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferencias obtenidas exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Preferencias o vehículo no encontrado.' }),
    __param(0, (0, common_1.Param)('vehicleId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PreferencesController.prototype, "getByVehicle", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Guardar/actualizar preferencias (reemplaza todo)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferencias actualizadas con éxito.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de preferencias inválidos.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_preferences_dto_1.UpdatePreferencesDto]),
    __metadata("design:returntype", void 0)
], PreferencesController.prototype, "updatePreferences", null);
exports.PreferencesController = PreferencesController = __decorate([
    (0, swagger_1.ApiTags)('preferences'),
    (0, common_1.Controller)('preferences'),
    __metadata("design:paramtypes", [preferences_service_1.PreferencesService])
], PreferencesController);
//# sourceMappingURL=preferences.controller.js.map