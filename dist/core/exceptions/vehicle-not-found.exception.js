"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class VehicleNotFoundException extends common_1.NotFoundException {
    constructor(vehicleId) {
        super(`Vehículo con ID ${vehicleId} no encontrado`);
    }
}
exports.VehicleNotFoundException = VehicleNotFoundException;
//# sourceMappingURL=vehicle-not-found.exception.js.map