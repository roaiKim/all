import { Select } from "antd";
import DevProxy from "config/development.proxy";
import { DEV_PROXY_HOST, isDevelopment } from "config/static-constant";
import { StorageService } from "utils/StorageService";

function ProxyConfigDataSource() {
    return Object.entries(DevProxy).map(([value, label]) => ({ value, label: `${value}(${label})` }));
}

const options = ProxyConfigDataSource();

export function ProxySelector() {
    if (isDevelopment) {
        let proxyHost = StorageService.get(DEV_PROXY_HOST);

        if (!proxyHost) {
            const { value } = options?.[0] || {};
            proxyHost = value;
        }

        return (
            <div className="ro-proxy">
                <Select
                    defaultValue={proxyHost}
                    size="small"
                    style={{ width: 360 }}
                    onChange={(value) => {
                        StorageService.set(DEV_PROXY_HOST, value);
                        // setHost();
                    }}
                    options={options}
                />
            </div>
        );
    }
    return null;
}
