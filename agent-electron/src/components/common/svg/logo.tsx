import React, { useId, useLayoutEffect, useRef, useState } from "react";

type LogoProps = React.SVGProps<SVGSVGElement> & {
    text?: string;
    fontSize?: number;
    width?: number;
    height?: number;
};

const RoaikimLogo: React.FC<LogoProps> = ({ text = "智联物流", fontSize = 28, width = 200, height = 46, ...props }) => {
    const gradientId = useId();
    const measureRef = useRef<SVGTextElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const centerX = width / 2;
    const centerY = height / 2;

    const textStyle: React.CSSProperties = {
        fontFamily: '"ZCOOL KuaiLe", "Alibaba PuHuiTi", "PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize,
        fontWeight: 600,
        letterSpacing: 4,
    };

    useLayoutEffect(() => {
        if (!measureRef.current) return;

        const box = measureRef.current.getBBox();
        setOffset({
            x: centerX - (box.x + box.width / 2),
            y: centerY - (box.y + box.height / 2),
        });
    }, [text, fontSize, width, height, centerX, centerY]);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="roaikim logo"
            {...props}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1f2433" />
                    <stop offset="50%" stopColor="#2a3144" />
                    <stop offset="100%" stopColor="#1f2433" />
                </linearGradient>
            </defs>

            <rect x={0} y={0} width={width} height={height} fill="#ffffff" />

            <text ref={measureRef} x={0} y={0} style={textStyle} visibility="hidden">
                {text}
            </text>

            <g transform={`translate(${offset.x} ${offset.y})`}>
                <text
                    x={0}
                    y={0}
                    style={textStyle}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={320}
                    strokeDashoffset={320}
                >
                    {text}
                    <animate attributeName="stroke-dashoffset" from="320" to="0" dur="5.2s" repeatCount="indefinite" />
                </text>

                <text x={0} y={0} style={textStyle} fill={`url(#${gradientId})`} fillOpacity={0}>
                    {text}
                    <animate attributeName="fill-opacity" values="0;0;1" keyTimes="0;0.7;1" dur="5.2s" repeatCount="indefinite" />
                </text>
            </g>
        </svg>
    );
};

export default RoaikimLogo;
