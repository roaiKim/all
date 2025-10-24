import React, { useEffect, useMemo, useState } from "react";
// import { LoadingOutlined } from "@ant-design/icons";
import { IconManifestType, IconsManifest, type IconType } from "react-icons";

// 图标缓存对象
const iconCache = new Map<string, IconType>();

export type RoveIconLibsType =
    | "ci"
    | "fa"
    | "fa6"
    | "io"
    | "io5"
    | "md"
    | "ti"
    | "go"
    | "fi"
    | "lu"
    | "gi"
    | "wi"
    | "di"
    | "ai"
    | "bs"
    | "ri"
    | "fc"
    | "gr"
    | "hi"
    | "hi2"
    | "si"
    | "sl"
    | "im"
    | "bi"
    | "cg"
    | "vsc"
    | "tb"
    | "tfi"
    | "rx"
    | "pi"
    | "lia";

type PrmiseLibsKeyType = Record<RoveIconLibsType, () => Promise<Record<string, any>>>;

const PrmiseLibsKey: PrmiseLibsKeyType = {
    ci: () => import("react-icons/ci"),
    fa: () => import("react-icons/fa"),
    fa6: () => import("react-icons/fa6"),
    io: () => import("react-icons/io"),
    io5: () => import("react-icons/io5"),
    md: () => import("react-icons/md"),
    ti: () => import("react-icons/ti"),
    go: () => import("react-icons/go"),
    fi: () => import("react-icons/fi"),
    lu: () => import("react-icons/lu"),
    gi: () => import("react-icons/gi"),
    wi: () => import("react-icons/wi"),
    di: () => import("react-icons/di"),
    ai: () => import("react-icons/ai"),
    bs: () => import("react-icons/bs"),
    ri: () => import("react-icons/ri"),
    fc: () => import("react-icons/fc"),
    gr: () => import("react-icons/gr"),
    hi: () => import("react-icons/hi"),
    hi2: () => import("react-icons/hi2"),
    si: () => import("react-icons/si"),
    sl: () => import("react-icons/sl"),
    im: () => import("react-icons/im"),
    bi: () => import("react-icons/bi"),
    cg: () => import("react-icons/cg"),
    vsc: () => import("react-icons/vsc"),
    tb: () => import("react-icons/tb"),
    tfi: () => import("react-icons/tfi"),
    rx: () => import("react-icons/rx"),
    pi: () => import("react-icons/pi"),
    lia: () => import("react-icons/lia"),
};

interface RoveIconProps extends React.SVGAttributes<SVGElement> {
    /**
     * @description lib name
     */
    lib: RoveIconLibsType;
    /**
     * @description icon name
     */
    name: string;
    /**
     * @description width
     * @default 24 px
     */
    width?: number;
    /**
     * @description width
     * @default 24 px
     */
    height?: number;
    /**
     * @description icon color
     */
    color?: string;
    /**
     * @description if not found,return it
     */
    fallback?: React.ReactNode;
    /**
     * @description loading, show it
     */
    loadingIndicator?: React.ReactNode;
    // [key: string]: any;
}

export const useGetIconLib = (lib: RoveIconLibsType, name?: string) => {
    const [IconComponent, setIconComponent] = useState<IconType | null>(null);
    const [Icons, setIcons] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!lib) return;
        const cacheKey = `${lib}:${name}`;
        const loadIcon = async () => {
            try {
                // 检查缓存
                if (iconCache.has(cacheKey)) {
                    setIconComponent(() => iconCache.get(cacheKey)!);
                    return;
                }
                setLoading(true);
                // // 动态加载图标库
                const module = await PrmiseLibsKey[lib]();
                if (name) {
                    const icon = module[name as keyof typeof module] as any;
                    if (!icon) throw new Error(`Icon ${name} not found`);
                    // 更新缓存和状态
                    iconCache.set(cacheKey, icon);
                    setIconComponent(() => icon);
                    setIcons([]);
                    setLoading(false);
                    return;
                } else {
                    const icons = Object.entries(module).map(([name, Component]) => ({ name, Component }));
                    setIconComponent(null);
                    setIcons(icons);
                    setLoading(false);
                }
            } catch (err) {
                console.error(`[DynamicIcon] Failed to load ${cacheKey}:`, err);
            }
        };
        loadIcon();
    }, [lib, name]);

    return {
        Icon: IconComponent,
        IconList: Icons,
        loading,
    };
};
// Popular icons
export const RoveIcon: React.FC<RoveIconProps> = ({
    lib,
    name,
    width,
    height,
    color,
    fallback = null,
    loadingIndicator = null, //<LoadingOutlined style={{ width: 16, height: 16, color: "#a4a4a4" }} />,
    ...props
}) => {
    const [Icon, setIcon] = useState<IconType | null>(null);
    const [loading, setLoading] = useState(true);
    const cacheKey = `${lib}:${name}`;

    useEffect(() => {
        const loadIcon = async () => {
            try {
                // 检查缓存
                if (iconCache.has(cacheKey)) {
                    setIcon(() => iconCache.get(cacheKey)!);
                    return;
                }
                // // 动态加载图标库
                const module = await PrmiseLibsKey[lib]();
                console.log("--module--", module);
                const icon = module[name as keyof typeof module] as any;

                if (!icon) throw new Error(`Icon ${name} not found`);

                // 更新缓存和状态
                iconCache.set(cacheKey, icon);
                setIcon(() => icon);
            } catch (err) {
                console.error(`[DynamicIcon] Failed to load ${cacheKey}:`, err);
            } finally {
                setLoading(false);
            }
        };
        if (!lib || !name) {
            setIcon(() => null);
            return;
        }
        loadIcon();
    }, [cacheKey]);

    if (loading && loadingIndicator) return <>{loadingIndicator}</>;
    if (!Icon) return <>{fallback}</>;
    if (width || height || color) {
        return <Icon style={{ width, height, color }} {...props} />;
    }
    return <Icon {...props} />;
};
