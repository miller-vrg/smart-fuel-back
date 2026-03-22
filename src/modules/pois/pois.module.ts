import { Module } from '@nestjs/common';
import { NominatimService } from './nominatim.service';
import { PoisService } from './pois.service';
import { PoisController } from './pois.controller';
import { PreferencesModule } from '@modules/preferences/preferences.module';
import { GEOCODING_SERVICE } from './interfaces/geocoding-service.interface';

/**
 * PoisModule – Módulo de Puntos de Interés.
 *
 * Para cambiar el proveedor de geocodificación:
 * 1. Importa la clase concreta (ej: MapboxService)
 * 2. Cambia `useClass: NominatimService` → `useClass: MapboxService`
 *
 * Principio: OCP – abierto a extensión (nuevo proveedor), cerrado a modificación
 * (PoisService y PoisController no cambian).
 */
@Module({
  imports: [PreferencesModule],
  controllers: [PoisController],
  providers: [
    {
      provide: GEOCODING_SERVICE,
      useClass: NominatimService,   // ← Swap aquí: MapboxService | NominatimService | GoogleService
    },
    PoisService,
  ],
  exports: [PoisService],
})
export class PoisModule {}
