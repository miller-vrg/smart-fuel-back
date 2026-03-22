export declare const appConfig: (() => {
    nodeEnv: string;
    port: number;
    jwtSecret: string;
    jwtExpiresIn: string;
    mapboxApiKey: string;
    anomalyThreshold: number;
    defaultSafetyBuffer: number;
    corsOrigins: string[];
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    jwtSecret: string;
    jwtExpiresIn: string;
    mapboxApiKey: string;
    anomalyThreshold: number;
    defaultSafetyBuffer: number;
    corsOrigins: string[];
}>;
