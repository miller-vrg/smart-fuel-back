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
exports.PoisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pois_service_1 = require("./pois.service");
let PoisController = class PoisController {
    constructor(poisService) {
        this.poisService = poisService;
    }
    findNearestByPreference(lat, lon, vehicleId, rangeKm) {
        return this.poisService.findNearestByPreference(lat, lon, vehicleId, rangeKm);
    }
};
exports.PoisController = PoisController;
__decorate([
    (0, common_1.Get)('nearest'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener estaciones priorizadas por preferencia dentro del rango de autonomía',
    }),
    (0, swagger_1.ApiQuery)({ name: 'lat', type: Number, description: 'Latitud actual' }),
    (0, swagger_1.ApiQuery)({ name: 'lon', type: Number, description: 'Longitud actual' }),
    (0, swagger_1.ApiQuery)({ name: 'vehicleId', type: String, description: 'UUID del vehículo' }),
    (0, swagger_1.ApiQuery)({ name: 'rangeKm', type: Number, description: 'Autonomía real disponible (Km)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de estaciones más cercanas ordenadas por preferencia.' }),
    __param(0, (0, common_1.Query)('lat', common_1.ParseFloatPipe)),
    __param(1, (0, common_1.Query)('lon', common_1.ParseFloatPipe)),
    __param(2, (0, common_1.Query)('vehicleId')),
    __param(3, (0, common_1.Query)('rangeKm', common_1.ParseFloatPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number]),
    __metadata("design:returntype", void 0)
], PoisController.prototype, "findNearestByPreference", null);
exports.PoisController = PoisController = __decorate([
    (0, swagger_1.ApiTags)('pois'),
    (0, common_1.Controller)('pois'),
    __metadata("design:paramtypes", [pois_service_1.PoisService])
], PoisController);
//# sourceMappingURL=pois.controller.js.map