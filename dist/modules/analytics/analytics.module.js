"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const anomaly_detector_service_1 = require("./anomaly-detector.service");
const fuel_module_1 = require("../fuel/fuel.module");
const alerts_module_1 = require("../alerts/alerts.module");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [fuel_module_1.FuelModule, alerts_module_1.AlertsModule],
        providers: [analytics_service_1.AnalyticsService, anomaly_detector_service_1.AnomalyDetectorService],
        exports: [analytics_service_1.AnalyticsService, anomaly_detector_service_1.AnomalyDetectorService],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map