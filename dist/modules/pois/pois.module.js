"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoisModule = void 0;
const common_1 = require("@nestjs/common");
const nominatim_service_1 = require("./nominatim.service");
const pois_service_1 = require("./pois.service");
const pois_controller_1 = require("./pois.controller");
const preferences_module_1 = require("../preferences/preferences.module");
const geocoding_service_interface_1 = require("./interfaces/geocoding-service.interface");
let PoisModule = class PoisModule {
};
exports.PoisModule = PoisModule;
exports.PoisModule = PoisModule = __decorate([
    (0, common_1.Module)({
        imports: [preferences_module_1.PreferencesModule],
        controllers: [pois_controller_1.PoisController],
        providers: [
            {
                provide: geocoding_service_interface_1.GEOCODING_SERVICE,
                useClass: nominatim_service_1.NominatimService,
            },
            pois_service_1.PoisService,
        ],
        exports: [pois_service_1.PoisService],
    })
], PoisModule);
//# sourceMappingURL=pois.module.js.map