"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NominatimService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NominatimService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let NominatimService = NominatimService_1 = class NominatimService {
    constructor() {
        this.logger = new common_1.Logger(NominatimService_1.name);
        this.overpassUrl = 'https://overpass-api.de/api/interpreter';
    }
    async findNearbyGasStations(lat, lon, radiusKm) {
        try {
            const radiusMeters = Math.round(radiusKm * 1000);
            const query = `
        [out:json][timeout:10];
        (
          node["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
          way["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
        );
        out center body 10;
      `;
            const response = await axios_1.default.post(this.overpassUrl, `data=${encodeURIComponent(query)}`, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 12000,
            });
            const elements = response.data.elements;
            return elements
                .map((el) => {
                const elLat = el.lat ?? el.center?.lat;
                const elLon = el.lon ?? el.center?.lon;
                if (!elLat || !elLon)
                    return null;
                return {
                    id: `osm-${el.type}-${el.id}`,
                    name: el.tags?.name ?? 'Estación sin nombre',
                    brand: el.tags?.brand ?? el.tags?.operator ?? 'Genérica',
                    distanceKm: this.haversineKm(lat, lon, elLat, elLon),
                    latitude: elLat,
                    longitude: elLon,
                    address: this.buildAddress(el),
                };
            })
                .filter((poi) => poi !== null)
                .sort((a, b) => a.distanceKm - b.distanceKm);
        }
        catch (error) {
            const errMessage = error instanceof Error ? error.message : String(error);
            this.logger.error('Error consultando Overpass API (OSM)', errMessage);
            return this.getMockStations(lat, lon);
        }
    }
    buildAddress(el) {
        const street = el.tags?.['addr:street'] ?? '';
        const city = el.tags?.['addr:city'] ?? '';
        return [street, city].filter(Boolean).join(', ') || 'Dirección desconocida';
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
exports.NominatimService = NominatimService;
exports.NominatimService = NominatimService = NominatimService_1 = __decorate([
    (0, common_1.Injectable)()
], NominatimService);
//# sourceMappingURL=nominatim.service.js.map