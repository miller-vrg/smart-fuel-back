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
var PoisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoisService = void 0;
const common_1 = require("@nestjs/common");
const preferences_service_1 = require("../preferences/preferences.service");
const geocoding_service_interface_1 = require("./interfaces/geocoding-service.interface");
let PoisService = PoisService_1 = class PoisService {
    constructor(geocodingService, preferencesService) {
        this.geocodingService = geocodingService;
        this.preferencesService = preferencesService;
        this.logger = new common_1.Logger(PoisService_1.name);
    }
    async findNearestByPreference(lat, lon, vehicleId, safeRangeKm) {
        const [allStations, orderedBrands, excludedBrands] = await Promise.all([
            this.geocodingService.findNearbyGasStations(lat, lon, safeRangeKm),
            this.preferencesService.getOrderedBrands(vehicleId),
            this.preferencesService.getExcludedBrands(vehicleId),
        ]);
        const available = allStations.filter((s) => !excludedBrands.some((b) => b.toLowerCase() === s.brand.toLowerCase()));
        const ranked = available.map((station) => {
            const rankIndex = orderedBrands.findIndex((b) => b.toLowerCase() === station.brand.toLowerCase());
            return {
                ...station,
                preferenceRank: rankIndex >= 0 ? rankIndex + 1 : null,
                isRecommended: false,
            };
        });
        const recommended = this.resolveBestOption(ranked, safeRangeKm, orderedBrands);
        this.logger.log(`POIs: ${available.length} disponibles, rango seguro: ${safeRangeKm}km → recomendada: ${recommended?.name ?? 'ninguna'}`);
        return ranked
            .map((s) => ({ ...s, isRecommended: s.id === recommended?.id }))
            .sort((a, b) => {
            if (a.isRecommended)
                return -1;
            if (b.isRecommended)
                return 1;
            if (a.preferenceRank !== null && b.preferenceRank !== null)
                return a.preferenceRank - b.preferenceRank;
            if (a.preferenceRank !== null)
                return -1;
            if (b.preferenceRank !== null)
                return 1;
            return a.distanceKm - b.distanceKm;
        });
    }
    resolveBestOption(stations, safeRangeKm, orderedBrands) {
        const inRange = stations.filter((s) => s.distanceKm <= safeRangeKm);
        for (let rank = 1; rank <= orderedBrands.length; rank++) {
            const match = inRange
                .filter((s) => s.preferenceRank === rank)
                .sort((a, b) => a.distanceKm - b.distanceKm)[0];
            if (match)
                return match;
        }
        return inRange.sort((a, b) => a.distanceKm - b.distanceKm)[0] ?? null;
    }
};
exports.PoisService = PoisService;
exports.PoisService = PoisService = PoisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(geocoding_service_interface_1.GEOCODING_SERVICE)),
    __metadata("design:paramtypes", [Object, preferences_service_1.PreferencesService])
], PoisService);
//# sourceMappingURL=pois.service.js.map