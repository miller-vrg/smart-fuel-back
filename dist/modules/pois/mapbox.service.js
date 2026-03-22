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
var MapboxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapboxService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let MapboxService = MapboxService_1 = class MapboxService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MapboxService_1.name);
        this.baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
        this.apiKey = this.configService.get('app.mapboxApiKey') ?? '';
    }
    async findNearbyGasStations(lat, lon, radiusKm) {
        if (!this.apiKey || this.apiKey.includes('REEMPLAZAR')) {
            this.logger.warn('Mapbox API key no configurada – usando datos mock');
            return this.getMockStations(lat, lon);
        }
        try {
            const url = `${this.baseUrl}/fuel station.json`;
            const response = await axios_1.default.get(url, {
                params: {
                    access_token: this.apiKey,
                    proximity: `${lon},${lat}`,
                    limit: 10,
                    types: 'poi',
                    bbox: this.getBoundingBox(lat, lon, radiusKm),
                },
            });
            return response.data.features.map((feature) => ({
                id: feature.id,
                name: feature.text,
                brand: this.extractBrand(feature.properties?.category ?? ''),
                distanceKm: this.haversineKm(lat, lon, feature.center[1], feature.center[0]),
                latitude: feature.center[1],
                longitude: feature.center[0],
                address: feature.place_name,
            }));
        }
        catch (error) {
            const errMessage = error instanceof Error ? error.message : String(error);
            this.logger.error('Error consultando Mapbox API', errMessage);
            return this.getMockStations(lat, lon);
        }
    }
    getBoundingBox(lat, lon, radiusKm) {
        const deg = radiusKm / 111;
        return `${lon - deg},${lat - deg},${lon + deg},${lat + deg}`;
    }
    extractBrand(category) {
        const brands = ['Terpel', 'Primax', 'EDS', 'Texaco', 'Petrobras', 'Mobil', 'BP'];
        return brands.find((b) => category.toLowerCase().includes(b.toLowerCase())) ?? 'Genérica';
    }
    haversineKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    toRad(value) {
        return (value * Math.PI) / 180;
    }
    getMockStations(lat, lon) {
        return [
            { id: 'mock-1', name: 'Terpel Autopista Norte', brand: 'Terpel', distanceKm: 12.4, latitude: lat + 0.05, longitude: lon + 0.02, address: 'Autopista Norte Km 12' },
            { id: 'mock-2', name: 'Primax Centro Comercial', brand: 'Primax', distanceKm: 18.2, latitude: lat - 0.08, longitude: lon + 0.05, address: 'Cra 15 # 85-40' },
            { id: 'mock-3', name: 'EDS El Dorado', brand: 'EDS', distanceKm: 25.7, latitude: lat + 0.1, longitude: lon - 0.03, address: 'Av El Dorado # 68-32' },
            { id: 'mock-4', name: 'Terpel Usaquén', brand: 'Terpel', distanceKm: 31.1, latitude: lat + 0.15, longitude: lon + 0.08, address: 'Cra 7 # 127-45' },
            { id: 'mock-5', name: 'Texaco Kennedy', brand: 'Texaco', distanceKm: 42.3, latitude: lat - 0.2, longitude: lon - 0.1, address: 'Av Boyacá # 35-12' },
        ];
    }
};
exports.MapboxService = MapboxService;
exports.MapboxService = MapboxService = MapboxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MapboxService);
//# sourceMappingURL=mapbox.service.js.map