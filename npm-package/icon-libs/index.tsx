import { LoadingOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useMemo } from "react";
import type { IconType } from "react-icons";

// 图标缓存对象
const iconCache = new Map<string, IconType>();

const LibIconTypeMap = {
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
    lia: () => import("react-icons/lia")
};

export type LibIconType = keyof typeof LibIconTypeMap;

interface DynamicIconProps extends React.SVGAttributes<SVGElement> {
    lib: LibIconType;
    name: string;
    width?: number;
    height?: number;
    color?: string;
    fallback?: React.ReactNode;
    loadingIndicator?: React.ReactNode;
    [key: string]: any;
}

export const useGetIconLib = (lib: LibIconType, name?: string) => {
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
                const module = await LibIconTypeMap[lib]();
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
        loading
    };
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
    lib,
    name,
    width,
    height,
    color,
    fallback = null,
    loadingIndicator = <LoadingOutlined style={{ width: 16, height: 16, color: "#a4a4a4" }} />,
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
                const module = await LibIconTypeMap[lib]();

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
