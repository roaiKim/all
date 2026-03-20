import { APP_NAME } from "config/static-constant";

interface PutToRecentUsedConfig<T> {
    maxSize?: number;
    comparator?: (a: T, b: T) => boolean;
}

export class StorageService {
    static getWebName(key: string) {
        return `${APP_NAME}_${key}`;
    }

    static set<T>(key: string, data: T | null) {
        if (data !== null) {
            localStorage.setItem(this.getWebName(key), JSON.stringify(data));
        } else {
            localStorage.removeItem(this.getWebName(key));
        }
    }

    static get<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const data = localStorage.getItem(this.getWebName(key));
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue; // In case fail to parse
        }
    }

    static remove(key: string) {
        localStorage.removeItem(this.getWebName(key));
    }

    static clear() {
        localStorage.clear();
    }

    static putToRecentList<T>(key: string, data: T, config: PutToRecentUsedConfig<T> = {}): void {
        const defaultConfig: PutToRecentUsedConfig<T> = {
            maxSize: 5,
            comparator: (a, b) => a === b,
        };

        config = { ...defaultConfig, ...config };

        const list = StorageService.getRecentList<T>(this.getWebName(key));
        const existIndex = list.findIndex((_) => config!.comparator!(_, data));
        if (existIndex >= 0) {
            list.splice(existIndex, 1);
            list.unshift(data);
        } else {
            list.unshift(data);
            if (list.length > config!.maxSize!) {
                list.splice(config.maxSize!);
            }
        }

        StorageService.set(this.getWebName(key), list);
    }

    static getRecentList<T>(key: string): T[] {
        let result: T[] = StorageService.get<T[]>(this.getWebName(key))!;
        if (!Array.isArray(result)) {
            result = [];
        }
        return result;
    }
}
