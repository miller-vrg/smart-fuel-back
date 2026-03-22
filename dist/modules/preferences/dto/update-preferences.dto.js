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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceItemDto = exports.UpdatePreferencesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UpdatePreferencesDto {
}
exports.UpdatePreferencesDto = UpdatePreferencesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'UUID del vehículo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista ordenada de marcas preferidas',
        example: [
            { brandName: 'Terpel', priority: 1, onlyHighway: false },
            { brandName: 'Primax', priority: 2, onlyHighway: false },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PreferenceItemDto),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "preferences", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Marcas excluidas', example: ['BP', 'Mobil'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdatePreferencesDto.prototype, "excludedBrands", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Avisar buscar gasolina Q km antes de vacío', example: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "notifyGasStationKmBefore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Avisar descanso tras HH horas de viaje', example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdatePreferencesDto.prototype, "notifyRestStopHours", void 0);
class PreferenceItemDto {
}
exports.PreferenceItemDto = PreferenceItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la marca de combustible', example: 'Terpel' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], PreferenceItemDto.prototype, "brandName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nivel de prioridad (1 = mayor, 10 = menor)', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], PreferenceItemDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Solo sugerir en carretera', example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PreferenceItemDto.prototype, "onlyHighway", void 0);
//# sourceMappingURL=update-preferences.dto.js.map