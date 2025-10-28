import { useEffect, useState } from "react";
import { IconType } from "react-icons";

// cache
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

export const useGetRoveIcons = (lib: RoveIconLibsType, name?: string) => {
    const [Icon, setIcon] = useState<IconType | null>(null);

    const [IconList, setIconList] = useState([]);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!lib) return;
        const cacheKey = `${lib}:${name}`;
        const loadIcon = async () => {
            try {
                // cache
                if (iconCache.has(cacheKey)) {
                    setIcon(() => iconCache.get(cacheKey)!);
                    return;
                }
                setLoading(true);
                const module = await PrmiseLibsKey[lib]();
                if (name) {
                    const icon = module[name as keyof typeof module] as any;
                    if (!icon) throw new Error(`Icon ${name} not found`);
                    iconCache.set(cacheKey, icon);
                    setIcon(() => icon);
                    setIconList([]);
                    setLoading(false);
                    return;
                } else {
                    const icons = Object.entries(module).map(([name, Component]) => ({ name, Component }));
                    setIcon(null);
                    setIconList(icons);
                    setLoading(false);
                }
            } catch (err) {
                console.error(`[DynamicIcon] Failed to load ${cacheKey}:`, err);
                setLoading(false);
            }
        };
        loadIcon();
    }, [lib, name]);

    return {
        Icon,
        IconList,
        loading,
    };
};
