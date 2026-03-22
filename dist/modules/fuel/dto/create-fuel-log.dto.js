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
exports.CreateFuelLogDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateFuelLogDto {
}
exports.CreateFuelLogDto = CreateFuelLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del vehículo', example: 'uuid-del-vehiculo' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFuelLogDto.prototype, "vehicleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Galones cargados en este tanqueo', example: 10.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateFuelLogDto.prototype, "gallonsAdded", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio por galón en moneda local', example: 15000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateFuelLogDto.prototype, "pricePerGallon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lectura del odómetro actual', example: 85430 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFuelLogDto.prototype, "odometer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre de la estación', example: 'Terpel Autopista Norte' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], CreateFuelLogDto.prototype, "stationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Marca de la estación', example: 'Terpel' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateFuelLogDto.prototype, "stationBrand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitud de la estación', example: 4.710989 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateFuelLogDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitud de la estación', example: -74.072092 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateFuelLogDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notas adicionales' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateFuelLogDto.prototype, "notes", void 0);
//# sourceMappingURL=create-fuel-log.dto.js.map