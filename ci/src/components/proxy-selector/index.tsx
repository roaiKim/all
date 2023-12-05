import React from "react";
import { Select } from "antd";
import { setHost } from "@http";
import { DEV_PROXY_HOST, isDevelopment } from "config/static-envs";
import { ProxyConfigDataSource } from "utils/function";
import { StorageService } from "utils/StorageService";

export function ProxySelector() {
    if (isDevelopment) {
        return (
            <div className="ro-proxy">
                <Select
                    defaultValue={StorageService.get(DEV_PROXY_HOST)}
                    size="small"
                    style={{ width: 360 }}
                    onChange={(value) => {
                        StorageService.set(DEV_PROXY_HOST, value);
                        setHost();
                    }}
                    options={ProxyConfigDataSource()}
                />
            </div>
        );
    }
    return null;
}
