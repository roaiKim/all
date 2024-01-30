import { FileOutline, ReceiptOutline, StarOutline } from "antd-mobile-icons";

interface MenuIconType {
    operation: React.ReactNode;
    quality: React.ReactNode;
    finance: React.ReactNode;
}

export const MenuIcon: MenuIconType = {
    operation: <ReceiptOutline />,
    quality: <StarOutline />,
    finance: <FileOutline />,
};
