```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas 烟花特效</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            overflow: hidden;
            background: #000;
        }
        canvas {
            display: block;
            width: 100vw;
            height: 100vh;
        }
    </style>
</head>
<body>
    <canvas id="fireworks"></canvas>

    <script>
        // 获取Canvas和上下文
        const canvas = document.getElementById('fireworks');
        const ctx = canvas.getContext('2d');

        // 设置Canvas尺寸为窗口大小
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 随机数工具函数
        const random = (min, max) => Math.random() * (max - min) + min;
        // 颜色转换工具函数 (HSV转RGB)
        const hsvToRgb = (h, s, v) => {
            let r, g, b;
            const i = Math.floor(h * 6);
            const f = h * 6 - i;
            const p = v * (1 - s);
            const q = v * (1 - f * s);
            const t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        };

        // 粒子类
        class Particle {
            constructor(x, y, color) {
                // 位置
                this.x = x;
                this.y = y;
                // 初始位置（用于轨迹计算）
                this.sx = x;
                this.sy = y;
                // 速度
                this.vx = random(-3, 3);
                this.vy = random(-3, 3);
                // 重力
                this.gravity = 0.05;
                // 阻力
                this.drag = 0.98;
                // 颜色
                this.color = color;
                // 生命周期
                this.life = 100;
                this.maxLife = this.life;
                // 大小
                this.size = random(1, 3);
            }

            // 更新粒子状态
            update() {
                // 应用重力
                this.vy += this.gravity;
                // 应用阻力
                this.vx *= this.drag;
                this.vy *= this.drag;
                // 更新位置
                this.x += this.vx;
                this.y += this.vy;
                // 减少生命周期
                this.life--;
            }

            // 绘制粒子
            draw() {
                ctx.save();
                // 计算透明度（随生命周期衰减）
                const alpha = this.life / this.maxLife;
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // 判断粒子是否存活
            isAlive() {
                return this.life > 0;
            }
        }

        // 烟花类
        class Firework {
            constructor() {
                // 发射起点（底部随机位置）
                this.x = random(canvas.width * 0.2, canvas.width * 0.8);
                this.y = canvas.height;
                // 目标爆炸点（随机高度）
                this.targetY = random(canvas.height * 0.2, canvas.height * 0.6);
                // 发射速度
                this.speed = random(4, 8);
                // 烟花颜色（随机色相）
                this.hue = random(0, 1);
                // 是否爆炸
                this.exploded = false;
                // 粒子数组
                this.particles = [];
                // 发射轨迹点
                this.trail = [];
            }

            // 更新烟花状态
            update() {
                if (!this.exploded) {
                    // 未爆炸：向上移动
                    this.y -= this.speed;
                    
                    // 记录轨迹（用于绘制发射线）
                    this.trail.push({ x: this.x, y: this.y });
                    if (this.trail.length > 20) {
                        this.trail.shift();
                    }

                    // 到达目标高度则爆炸
                    if (this.y <= this.targetY) {
                        this.explode();
                    }
                } else {
                    // 已爆炸：更新所有粒子
                    for (let i = this.particles.length - 1; i >= 0; i--) {
                        const particle = this.particles[i];
                        particle.update();
                        if (!particle.isAlive()) {
                            this.particles.splice(i, 1);
                        }
                    }
                }
            }

            // 爆炸生成粒子
            explode() {
                this.exploded = true;
                // 生成100-200个粒子
                const particleCount = random(100, 200);
                const color = hsvToRgb(this.hue, 0.8, 1);
                
                for (let i = 0; i < particleCount; i++) {
                    this.particles.push(new Particle(this.x, this.y, color));
                }
            }

            // 绘制烟花
            draw() {
                if (!this.exploded) {
                    // 绘制发射轨迹
                    ctx.save();
                    ctx.strokeStyle = `hsla(${this.hue * 360}, 100%, 50%, 0.8)`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(this.x, canvas.height);
                    
                    // 绘制轨迹点连线
                    for (let i = 0; i < this.trail.length; i++) {
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    }
                    ctx.stroke();
                    ctx.restore();

                    // 绘制烟花头部
                    ctx.save();
                    ctx.fillStyle = `hsl(${this.hue * 360}, 100%, 50%)`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    // 绘制所有粒子
                    this.particles.forEach(particle => particle.draw());
                }
            }

            // 判断烟花是否完全消失
            isGone() {
                return this.exploded && this.particles.length === 0;
            }
        }

        // 烟花数组
        let fireworks = [];

        // 动画循环
        function animate() {
            // 半透明黑色背景（实现拖影效果）
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 随机生成新烟花（概率控制）
            if (Math.random() < 0.05) {
                fireworks.push(new Firework());
            }

            // 更新和绘制所有烟花
            for (let i = fireworks.length - 1; i >= 0; i--) {
                const firework = fireworks[i];
                firework.update();
                firework.draw();

                // 移除已消失的烟花
                if (firework.isGone()) {
                    fireworks.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        }

        // 启动动画
        animate();

        // 点击屏幕生成烟花
        canvas.addEventListener('click', (e) => {
            const firework = new Firework();
            firework.x = e.clientX;
            firework.y = canvas.height;
            firework.targetY = e.clientY;
            fireworks.push(firework);
        });
    </script>
</body>
</html>
```