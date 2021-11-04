export interface LoggerConfig {
    serverURL: string;
    slowStartupThreshold?: number; // In second, default: 5
    maskedKeywords?: RegExp[];
}
