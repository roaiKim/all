import { View } from "@tarojs/components";
import { PropsWithChildren } from "react";
import { AtIcon } from "taro-ui";
import "./index.less";

interface NavListProps {
    hasBorder?: boolean;
    style?: React.CSSProperties;
}

function NavList(props: PropsWithChildren<NavListProps>) {
    const { hasBorder = true, children, style = {} } = props;

    return (
        <View className={`ro-nav-list-component ${hasBorder ? "ro-nav-border" : ""}`} style={style}>
            {children}
        </View>
    );
}

interface NavListItemProps {
    icon?: React.ReactNode;
    arrow?: "right" | "top" | "bottom" | "left";
    title?: React.ReactNode | string;
    rightValue?: React.ReactNode | string;
    childrenStyle?: React.CSSProperties;
    description?: string;
    onClick?: () => void;
}

function NavListItem(props: PropsWithChildren<NavListItemProps>) {
    const { children, icon, arrow, title, rightValue, description, onClick, childrenStyle } = props;

    return (
        <View className="ro-nav-list-item" onClick={onClick}>
            {icon}
            <View className="ro-nl-title-body">
                {title && (
                    <View>
                        <View className="ro-nl-title">{title}</View>
                        {description && <View className="ro-nl-description">{description}</View>}
                    </View>
                )}
                <View className="ro-nl-title-children" style={childrenStyle || {}}>
                    {rightValue}
                    {children}
                </View>
            </View>
            {arrow && <AtIcon className="btn-icon ro-nl-arrow" size={18} value={`chevron-${arrow}`}></AtIcon>}
        </View>
    );
}

NavList.NavListItem = NavListItem;

export { NavList };
