interface PutToRecentUsedConfig<T> {
    maxSize?: number;
    comparator?: (a: T, b: T) => boolean;
}

export class StorageService {
    static set<T>(key: string, data: T | null) {
        if (data !== null) {
            localStorage.setItem(key, JSON.stringify(data));
        } else {
            localStorage.removeItem(key);
        }
    }

    static get<T>(key: string, defaultValue: T | null = null): T | null {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            return defaultValue; // In case fail to parse
        }
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

        const list = StorageService.getRecentList<T>(key);
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

        StorageService.set(key, list);
    }

    static getRecentList<T>(key: string): T[] {
        let result: T[] = StorageService.get<T[]>(key)!;
        if (!Array.isArray(result)) {
            result = [];
        }
        return result;
    }
}
