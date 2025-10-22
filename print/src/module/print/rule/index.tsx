import { useEffect, useLayoutEffect } from "react";

function createHDCanvas(canvas, w, h) {
    const ratio = devicePixelRatio || 1;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    return canvas;
}

export default function Rule() {
    useLayoutEffect(() => {
        // 获取Canvas元素和上下文
        // const _canvas = document.getElementById("ruler");
        const canvas = document.getElementById("ruler");
        const ctx = canvas.getContext("2d");

        canvas.width = document.body.getBoundingClientRect().width;
        // createHDCanvas(canvas, canvas.width, 24);
        // canvas.height = 200;
        //▲初始化， ▼
        // for (let i = 1; i < parseInt(canvas.width / 100); i++) {
        //     ctx.beginPath();
        //     ctx.moveTo(i * 100 + 0.5, 0);
        //     ctx.lineTo(i * 100 + 0.5, canvas.height);
        //     ctx.strokeStyle = "rgba(0,0,0,0.9)"; //← 请看这里颜色是黑色透明的
        //     ctx.stroke();
        // }
        // return;
        // ctx.scale(2, 2);
        let rulerLength = canvas.width; // 初始长度
        // 绘制刻度尺函数
        function drawRuler() {
            // 清除画布
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log("--devicePixelRatio--", devicePixelRatio);
            // 设置刻度尺参数
            const startX = 0; // 起始位置
            const endX = rulerLength; // 结束位置
            const totalLength = endX - startX; // 总长度
            const smallTickInterval = 5; // 小刻度间隔(像素)
            const smallTickHeight = 10; // 小刻度高度
            const mediumTickHeight = 18; // 中刻度高度
            const largeTickHeight = 24; // 大刻度高度
            const tickY = canvas.height; // 刻度线Y坐标(中间位置)

            // 计算总刻度数
            const totalTicks = Math.floor(totalLength / smallTickInterval);

            // 绘制基线
            // ctx.beginPath();
            // ctx.moveTo(startX, tickY);
            // ctx.lineTo(startX, largeTickHeight);
            // // ctx.fillStyle = "#000";
            // ctx.strokeStyle = "#000";
            // ctx.lineWidth = 1;
            // ctx.stroke();

            // 绘制刻度线和数字;
            for (let i = 0; i <= totalTicks; i++) {
                const x = startX + i * smallTickInterval;
                let tickHeight;
                let lineWidth; // 刻度线宽度

                // // 确定刻度类型
                if (i % 10 === 0) {
                    // 大刻度(每10个小刻度)
                    tickHeight = largeTickHeight;
                    lineWidth = 1.2; // 大刻度稍粗（1.2px）
                    // 绘制刻度数字
                    ctx.font = "8px";
                    ctx.textAlign = "left";
                    ctx.textBaseline = "bottom";
                    ctx.fillText(i, x + 3, tickY - 15);
                } else if (i % 5 === 0) {
                    // 中刻度(每5个小刻度)
                    tickHeight = mediumTickHeight;
                    lineWidth = 0.8; // 大刻度稍粗（1.2px）
                } else {
                    // 小刻度
                    tickHeight = smallTickHeight;
                    lineWidth = 0.5; // 大刻度稍粗（1.2px）
                }

                // 绘制刻度线

                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1; //lineWidth; // 应用刻度线宽度
                ctx.beginPath();
                ctx.moveTo(x + 0.5, tickY);
                ctx.lineTo(x + 0.5, tickY - tickHeight);
                ctx.stroke();
            }
        }

        // 改变刻度尺长度
        function changeLength(length) {
            rulerLength = length;
            canvas.width = length;
            drawRuler();
        }

        // 重置刻度尺
        function resetRuler() {
            rulerLength = 800;
            canvas.width = 800;
            drawRuler();
        }

        // 初始绘制
        drawRuler();

        // const canvas1 = createHDCanvas(canvas, 800, 400);
        // 窗口大小改变时重新绘制
        // window.addEventListener("resize", drawRuler);
    }, []);
    return (
        <div>
            <canvas id="ruler" height="24"></canvas>
        </div>
    );
}
