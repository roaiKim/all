import { useEffect, useLayoutEffect } from "react";

export default function Rule() {
    useLayoutEffect(() => {
        const canvas = document.getElementById("ruler") as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        // 刻度尺配置
        const startPos = 50; // 起始位置
        const endPos = canvas.width - 50; // 结束位置
        const baseLineY = canvas.height / 2; // 基线Y坐标（刻度从这里向上延伸）
        const cmHeight = 30; // 厘米刻度高度
        const mmHeight = 15; // 毫米刻度高度
        const totalCm = 20; // 总厘米数

        // 计算每毫米的像素宽度
        const mmPerPixel = (endPos - startPos) / (totalCm * 10);

        // 绘制主刻度线（厘米）和数字
        function drawCmMarks() {
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom"; // 文字在刻度线顶部

            for (let cm = 0; cm <= totalCm; cm++) {
                const x = startPos + cm * 10 * mmPerPixel;

                // 绘制厘米刻度线（只向上延伸）
                ctx.beginPath();
                ctx.moveTo(x, baseLineY); // 从基线开始
                ctx.lineTo(x, baseLineY - cmHeight); // 向上绘制
                ctx.strokeStyle = "red";
                ctx.lineWidth = 1;
                ctx.stroke();

                // 绘制厘米数字（在刻度线顶部）
                ctx.fillText(cm + "", x, baseLineY - cmHeight - 5);
            }
        }

        // 绘制毫米刻度线
        function drawMmMarks() {
            ctx.lineWidth = 1;

            for (let cm = 0; cm < totalCm; cm++) {
                for (let mm = 1; mm < 10; mm++) {
                    // 5毫米刻度线稍长
                    const height = mm % 5 === 0 ? mmHeight * 1.5 : mmHeight;
                    const x = startPos + (cm * 10 + mm) * mmPerPixel;

                    ctx.beginPath();
                    ctx.moveTo(x, baseLineY); // 从基线开始
                    ctx.lineTo(x, baseLineY - height); // 向上绘制
                    ctx.strokeStyle = "blue";
                    ctx.stroke();
                }
            }
        }

        // 绘制刻度尺基线
        function drawBaseLine() {
            ctx.beginPath();
            ctx.moveTo(startPos, baseLineY);
            ctx.lineTo(endPos, baseLineY);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 绘制刻度尺
        function drawRuler() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBaseLine();
            drawCmMarks();
            drawMmMarks();
        }

        drawRuler();
    }, []);
    return (
        <div>
            <canvas id="ruler" width="800" height="100"></canvas>
        </div>
    );
}
