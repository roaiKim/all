export function ok<T>(data: T): { ok: true; data: T } {
    return { ok: true, data };
}

export function fail(error: unknown): { ok: false; code: string; message: string } {
    const err = error as { code?: string; message?: string };
    return {
        ok: false,
        code: err?.code || "UNKNOWN",
        message: err?.message || String(error),
    };
}
