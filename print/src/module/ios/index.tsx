import { useEffect, useRef } from "react";
import "./index.less";

const apps = [
    { name: "Finder", color: "linear-gradient(135deg, #8fd3ff, #2f7bff)" },
    { name: "Safari", color: "linear-gradient(135deg, #9be7ff, #2b6bff)" },
    { name: "Mail", color: "linear-gradient(135deg, #b3f0ff, #3b8bff)" },
    { name: "Photos", color: "conic-gradient(from 210deg, #ff9b9b, #ffd36b, #96ffa5, #6ecbff, #b58bff, #ff9b9b)" },
    { name: "Notes", color: "linear-gradient(135deg, #fff3b0, #ffd24d)" },
    { name: "Music", color: "linear-gradient(135deg, #ff9bd1, #ff3d6e)" },
    { name: "App Store", color: "linear-gradient(135deg, #a0c4ff, #4361ff)" },
    { name: "Settings", color: "linear-gradient(135deg, #cfd6dd, #8b97a8)" },
];

export default function IosDesktop() {
    const dockRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<HTMLDivElement[]>([]);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const handleMove = (event: MouseEvent) => {
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
            rafId.current = requestAnimationFrame(() => {
                const { clientX } = event;
                const sigma = 90;
                const maxScale = 0.75;
                itemRefs.current.forEach((item) => {
                    const rect = item.getBoundingClientRect();
                    const center = rect.left + rect.width / 2;
                    const distance = Math.abs(clientX - center);
                    const influence = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                    const scale = 1 + maxScale * influence;
                    const lift = (scale - 1) * 26;
                    item.style.setProperty("--dock-scale", scale.toFixed(3));
                    item.style.setProperty("--dock-lift", `${lift.toFixed(1)}px`);
                    item.style.setProperty("--dock-z", `${Math.round(scale * 100)}`);
                });
            });
        };

        const handleLeave = () => {
            itemRefs.current.forEach((item) => {
                item.style.setProperty("--dock-scale", "1");
                item.style.setProperty("--dock-lift", "0px");
                item.style.setProperty("--dock-z", "1");
            });
        };

        dock.addEventListener("mousemove", handleMove);
        dock.addEventListener("mouseleave", handleLeave);

        return () => {
            dock.removeEventListener("mousemove", handleMove);
            dock.removeEventListener("mouseleave", handleLeave);
            if (rafId.current !== null) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    return (
        <div className="ios-desktop">
            <div className="ios-wallpaper" />
            <header className="ios-menubar">
                <div className="ios-menubar-left">
                    <span className="ios-apple">Apple</span>
                    <span>Finder</span>
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Go</span>
                    <span>Window</span>
                    <span>Help</span>
                </div>
                <div className="ios-menubar-right">
                    <span className="ios-status-dot" />
                    <span>Wi-Fi</span>
                    <span>100%</span>
                    <span>Tue 9:41 AM</span>
                </div>
            </header>

            <main className="ios-stage">
                <section className="ios-icons">
                    {apps.map((app) => (
                        <div className="ios-icon" key={app.name}>
                            <div className="ios-icon-tile" style={{ background: app.color }} />
                            <span>{app.name}</span>
                        </div>
                    ))}
                </section>

                <section className="ios-window ios-window-primary">
                    <div className="ios-window-titlebar">
                        <div className="ios-traffic">
                            <span className="ios-btn close" />
                            <span className="ios-btn min" />
                            <span className="ios-btn max" />
                        </div>
                        <div className="ios-window-title">macOS Preview</div>
                        <div className="ios-window-actions">
                            <span className="ios-pill">Share</span>
                            <span className="ios-pill ghost">Edit</span>
                        </div>
                    </div>
                    <div className="ios-window-body">
                        <div className="ios-preview-card">
                            <div className="ios-preview-header">
                                <span>Design System</span>
                                <span>Version 12.4</span>
                            </div>
                            <div className="ios-preview-grid">
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                            <div className="ios-preview-footer">
                                <span>Updated 5 mins ago</span>
                                <button type="button">Open</button>
                            </div>
                        </div>
                        <div className="ios-preview-note">
                            <h3>Daily Focus</h3>
                            <p>Ship the next print template flow. Review the drag canvas motion.</p>
                            <div className="ios-progress">
                                <span />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ios-window ios-window-secondary">
                    <div className="ios-window-titlebar">
                        <div className="ios-traffic">
                            <span className="ios-btn close" />
                            <span className="ios-btn min" />
                            <span className="ios-btn max" />
                        </div>
                        <div className="ios-window-title">Music</div>
                        <div className="ios-window-actions">
                            <span className="ios-pill ghost">AirPlay</span>
                        </div>
                    </div>
                    <div className="ios-window-body compact">
                        <div className="ios-album" />
                        <div className="ios-track">
                            <h4>Midnight Skyline</h4>
                            <p>Neon Avenue</p>
                            <div className="ios-wave">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="ios-dock" ref={dockRef}>
                {apps.slice(0, 6).map((app, index) => (
                    <div
                        className="ios-dock-item"
                        key={app.name}
                        ref={(el) => {
                            if (el) itemRefs.current[index] = el;
                        }}
                    >
                        <div className="ios-icon-tile" style={{ background: app.color }} />
                        <span className="ios-dot" />
                    </div>
                ))}
                <div className="ios-dock-sep" />
                <div
                    className="ios-dock-item trash"
                    ref={(el) => {
                        if (el) itemRefs.current[apps.slice(0, 6).length] = el;
                    }}
                >
                    <div className="ios-icon-tile trash" />
                </div>
            </footer>
        </div>
    );
}
