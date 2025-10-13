import { useId, useState } from "react";
import { Item, type ItemParams, Menu, Separator, useContextMenu } from "react-contexify";
import { ChromeFilled } from "@ant-design/icons";
import ChromeStyleTabs from "@src/pages/chrome";
import type { ChromeStyleTabType } from "@src/pages/chrome/tab";

import "react-contexify/ReactContexify.css";

function ChromeExample1() {
    const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
        new Array(15).fill(0).map((item, index) => ({
            key: "Google" + index,
            label: "Google " + index,
            icon: "i",
            // disabled: index % 2 === 0,
        }))
    );
    const [activeKey, setActiveKey] = useState("Google3");

    const onCloseBefore = (tab, index) => {
        return Promise.resolve(!!(index % 2));
    };

    return (
        <div>
            <ChromeStyleTabs
                tabs={tabs}
                activeKey={activeKey}
                onClose={(tab, index, tabs) => {
                    setTabs(tabs);
                }}
                onDrag={(tabs) => {
                    setTabs(tabs);
                }}
                onCloseBefore={onCloseBefore}
            />
        </div>
    );
}

enum ContextMenuType {
    close = "close",
    refresh = "refresh",
    closeOther = "closeOther",
    closeAll = "closeAll",
    closeRight = "closeRight",
    closeLeft = "closeLeft",
}

const ContextMenu: React.FC<{ contextMenuClick: (e: any) => void; menuId: string }> = ({ contextMenuClick, menuId }) => {
    return (
        <Menu className="tab-hader-right-menu" preventDefaultOnKeydown={false} id={menuId}>
            <Item data={ContextMenuType.close} onClick={contextMenuClick}>
                <span className="right-click-menu-text">关闭</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.refresh} onClick={contextMenuClick}>
                <span className="right-click-menu-text">刷新</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeOther} onClick={contextMenuClick}>
                <span className="right-click-menu-text">关闭其他</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeAll} onClick={contextMenuClick}>
                <span className="right-click-menu-text">关闭全部</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeRight} onClick={contextMenuClick}>
                <span className="right-click-menu-text">关闭右侧所有</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeLeft} onClick={contextMenuClick}>
                <span className="right-click-menu-text">关闭左侧所有</span>
            </Item>
        </Menu>
    );
};

function ChromeExample2() {
    const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
        new Array(15).fill(0).map((item, index) => ({
            key: "Chrome" + index,
            label: "Chrome " + index,
            icon: <ChromeFilled />,
            // disabled: index % 2 === 0,
        }))
    );
    const MENU_ID = useId();
    const [activeKey, setActiveKey] = useState("Chrome3");

    const { show } = useContextMenu({
        id: MENU_ID,
    });

    function handleContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>, config: { id: string | number; index: number }) {
        show({ event, props: config });
    }

    function handleItemClick({ event, props, triggerEvent, data }: ItemParams<any, any>) {
        switch (data) {
            case ContextMenuType.close:
                // closeTab(props.id);
                return;
            case ContextMenuType.refresh:
                if (activeKey === props.id) {
                    // refreshAuto(props.id);
                }
                return;
            case ContextMenuType.closeOther:
                // closeOtherTab(props.id);
                return;
            case ContextMenuType.closeAll:
                // closeAllTab();
                return;
            case ContextMenuType.closeRight:
                // closeRightTab(props.id);
                return;
            case ContextMenuType.closeLeft:
                // closeLeftTab(props.id);
                return;
        }
    }

    return (
        <div style={{ width: "calc(100vw - 100px)", height: "80vh", background: "#ccc", padding: 10 }}>
            <ContextMenu contextMenuClick={handleItemClick} menuId={MENU_ID} />
            <ChromeStyleTabs
                tabs={tabs}
                activeKey={activeKey}
                onClose={(tab, index, tabs) => {
                    setTabs(tabs);
                }}
                onDrag={(tabs) => {
                    setTabs(tabs);
                }}
                onContextMenu={handleContextMenu}
            />
        </div>
    );
}

export default ChromeExample2;
