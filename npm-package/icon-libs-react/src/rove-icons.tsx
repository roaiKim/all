import React from "react";
import { RoveIconLibsType, useGetRoveIcons } from "./useGetRoveIcons";

export interface RoveIconProps extends React.SVGAttributes<SVGElement> {
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
}

export const RoveIcon: React.FC<RoveIconProps> = (props) => {
    const { lib, name, width, height, color, fallback = null, loadingIndicator = null, ...rest } = props;
    const { Icon, loading } = useGetRoveIcons(lib, name);

    if (loading && loadingIndicator) return <>{loadingIndicator}</>;
    if (!Icon) return <>{fallback}</>;
    if (width || height || color) {
        return <Icon style={{ width, height, color }} {...rest} />;
    }
    return <Icon {...rest} />;
};
