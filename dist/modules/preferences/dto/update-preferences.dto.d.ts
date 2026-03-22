export declare class UpdatePreferencesDto {
    vehicleId: string;
    preferences: PreferenceItemDto[];
    excludedBrands?: string[];
    notifyGasStationKmBefore?: number;
    notifyRestStopHours?: number;
}
export declare class PreferenceItemDto {
    brandName: string;
    priority: number;
    onlyHighway?: boolean;
}
