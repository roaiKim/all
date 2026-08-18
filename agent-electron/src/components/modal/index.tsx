import { type CSSProperties, type PropsWithChildren, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "antd";
import classNames from "classnames";
import { CloseOutlined } from "@ant-design/icons";
import { When } from "components/when";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

/** 关闭动画时长，需与 index.less 中的 transition 保持一致 */
const TRANSITION_DURATION = 200;

interface ModalProps {
    /** 是否显示弹窗（受控） */
    open?: boolean;
    /** 弹窗标题 */
    title?: ReactNode;
    /** 弹窗宽度，默认 520 */
    width?: number | string;
    /** 点击遮罩是否关闭，默认 true */
    maskClosable?: boolean;
    /** 是否显示右上角关闭按钮，默认 true */
    closable?: boolean;
    /**
     * 底部内容：
     * - `true`：渲染默认的「取消 / 确定」按钮
     * - `false`：不渲染底部（默认值）
     * - 其它 ReactNode：渲染为自定义底部
     */
    footer?: boolean | ReactNode;
    /** 确认按钮文案，默认「确定」 */
    okText?: string;
    /** 取消按钮文案，默认「取消」 */
    cancelText?: string;
    /** 确认按钮加载态 */
    okLoading?: boolean;
    /** 点击确认回调 */
    onOk?: () => void;
    /** 点击取消 / 遮罩 / 关闭按钮 / ESC 时触发 */
    onClose?: () => void;
    /** 关闭动画结束后的回调 */
    afterClose?: () => void;
    /** 是否垂直居中，默认 true */
    centered?: boolean;
    /** 层级，默认 1000 */
    zIndex?: number;
    className?: string;
    style?: CSSProperties;
}

export function Modal(props: PropsWithChildren<ModalProps>) {
    const {
        open = false,
        title,
        width = "70%",
        maskClosable = false,
        closable = true,
        footer = true,
        okText = "确定",
        cancelText = "取消",
        okLoading = false,
        onOk,
        onClose,
        afterClose,
        centered = true,
        zIndex = 1000,
        className,
        style,
        children,
    } = props;

    const [mounted, setMounted] = useState(open);
    const [visible, setVisible] = useState(false);

    // 用 ref 持有最新回调，避免 ESC / 遮罩监听因回调变化而频繁重建
    const onCloseRef = useRef(onClose);
    const afterCloseRef = useRef(afterClose);
    onCloseRef.current = onClose;
    afterCloseRef.current = afterClose;

    const prevOpenRef = useRef(open);

    useEffect(() => {
        const prevOpen = prevOpenRef.current;
        prevOpenRef.current = open;

        if (open) {
            setMounted(true);
            // 下一帧再置为可见，触发入场动画
            const raf = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(raf);
        }

        // 初始即为关闭状态时无需做关闭处理
        if (!prevOpen) {
            return;
        }

        setVisible(false);
        const timer = window.setTimeout(() => {
            setMounted(false);
            afterCloseRef.current?.();
        }, TRANSITION_DURATION);
        return () => window.clearTimeout(timer);
    }, [open]);

    // ESC 关闭
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onCloseRef.current?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    // 弹窗显示时锁定 body 滚动
    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    const handleMaskClick = useCallback(() => {
        if (maskClosable) {
            onCloseRef.current?.();
        }
    }, [maskClosable]);

    const handleClose = useCallback(() => {
        onCloseRef.current?.();
    }, []);

    if (!mounted) {
        return null;
    }

    const modalNode = (
        <div
            className={classNames(joinLessPrefix("modal-container"), className, {
                "is-visible": visible,
                "is-centered": centered,
            })}
            style={{ zIndex, ...style }}
        >
            <div className={joinLessPrefix("modal-mask")} onClick={handleMaskClick}></div>
            <div className={joinLessPrefix("modal-content")} style={{ width }}>
                <div className={joinLessPrefix("modal-title")}>
                    <When when={Boolean(title)}>
                        <div className={joinLessPrefix("modal-header")}>{title}</div>
                    </When>
                    <div className={joinLessPrefix("title-space")}></div>
                    <When when={closable}>
                        <CloseOutlined style={{ fontSize: 18 }} className={joinLessPrefix("modal-close")} aria-label="关闭" onClick={handleClose} />
                    </When>
                </div>
                <div className={classNames(joinLessPrefix("modal-body"), { "has-footer": footer === true })}>{children}</div>
                <When when={footer === true}>
                    <div className={joinLessPrefix("modal-footer")}>
                        <div className={joinLessPrefix("title-space")}></div>
                        <div className={joinLessPrefix("btn-container")}>
                            <Button type="default" className={joinLessPrefix("modal-btn")} onClick={handleClose}>
                                {cancelText}
                            </Button>
                            <Button
                                type="primary"
                                className={classNames(joinLessPrefix("modal-btn"), "is-primary")}
                                disabled={okLoading}
                                onClick={onOk}
                            >
                                <When when={okLoading}>
                                    <span className={joinLessPrefix("modal-btn-loading")}></span>
                                </When>
                                {okText}
                            </Button>
                        </div>
                    </div>
                </When>
                <When when={typeof footer !== "boolean"}>
                    <div className={joinLessPrefix("modal-footer")}>{footer}</div>
                </When>
            </div>
        </div>
    );
    // const modalNode = (
    //     <div
    //         className={classNames(joinLessPrefix("modal-container"), className, {
    //             "is-visible": visible,
    //             "is-centered": centered,
    //         })}
    //         style={{ zIndex, ...style }}
    //     >
    //         <div className={joinLessPrefix("modal-mask")} onClick={handleMaskClick}></div>
    //         <div className={joinLessPrefix("modal-wrap")} role="dialog" aria-modal="true">
    //             <div className={joinLessPrefix("modal-content")} style={{ width }}>
    //                 <When when={closable}>
    //                     <button type="button" className={joinLessPrefix("modal-close")} aria-label="关闭" onClick={handleClose}>
    //                         ×
    //                     </button>
    //                 </When>
    //                 <When when={Boolean(title)}>
    //                     <div className={joinLessPrefix("modal-header")}>{title}</div>
    //                 </When>
    //                 <div className={joinLessPrefix("modal-body")}>{children}</div>
    //                 <When when={footer === true}>
    //                     <div className={joinLessPrefix("modal-footer")}>
    //                         <button type="button" className={joinLessPrefix("modal-btn")} onClick={handleClose}>
    //                             {cancelText}
    //                         </button>
    //                         <button
    //                             type="button"
    //                             className={classNames(joinLessPrefix("modal-btn"), "is-primary")}
    //                             disabled={okLoading}
    //                             onClick={onOk}
    //                         >
    //                             <When when={okLoading}>
    //                                 <span className={joinLessPrefix("modal-btn-loading")}></span>
    //                             </When>
    //                             {okText}
    //                         </button>
    //                     </div>
    //                 </When>
    //                 <When when={typeof footer !== "boolean"}>
    //                     <div className={joinLessPrefix("modal-footer")}>{footer}</div>
    //                 </When>
    //             </div>
    //         </div>
    //     </div>
    // );

    return createPortal(modalNode, document.body);
}

export default Modal;
