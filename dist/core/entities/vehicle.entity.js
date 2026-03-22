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
exports.Vehicle = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const fuel_log_entity_1 = require("./fuel-log.entity");
const stop_preference_entity_1 = require("./stop-preference.entity");
let Vehicle = class Vehicle {
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "licensePlate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Vehicle.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 10 }),
    __metadata("design:type", String)
], Vehicle.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 8, scale: 2 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "fuelCapacityGallons", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 8, scale: 2 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "avgKmPerGallon", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 8, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "currentFuelGallons", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 4, scale: 2, default: 0.15 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "safetyBuffer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.vehicles, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Vehicle.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => fuel_log_entity_1.FuelLog, (log) => log.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "fuelLogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stop_preference_entity_1.StopPreference, (pref) => pref.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "stopPreferences", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 20 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "notifyGasStationKmBefore", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "notifyRestStopHours", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "activeTrip", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Vehicle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Vehicle.prototype, "updatedAt", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('vehicles')
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map