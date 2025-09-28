import { useEffect } from "react";
import L from "leaflet";
export default function Tile() {
    useEffect(() => {
        const map = L.map("ro-leaflet-map-tie", {
            crs: L.CRS.Simple, // 使用简单坐标系，适合图片拼接
            minZoom: 0,
            maxZoom: 3,
            zoomControl: false, // 禁用默认缩放控件
        });

        // 添加自定义缩放控件到右上角
        L.control
            .zoom({
                position: "topright",
            })
            .addTo(map);

        // 定义图片尺寸和瓦片信息
        // 这里我们使用一个虚拟的大图片，实际应用中需要替换为你的图片尺寸
        const imageWidth = 4000;
        const imageHeight = 3000;
        const tileSize = 256; // 瓦片大小，通常为256x256像素

        // 计算图片的边界
        const southWest = map.unproject([0, imageHeight], map.getMaxZoom());
        const northEast = map.unproject([imageWidth, 0], map.getMaxZoom());
        const bounds = new L.LatLngBounds(southWest, northEast);

        // 创建自定义瓦片图层
        const tileLayer = L.tileLayer("/tiles/{z}/{x}/{y}.png", {
            tms: true, // 使用TMS瓦片编号方式
            bounds,
            tileSize,
            attribution: "图片拼接技术演示 &copy; Leaflet.js",
        }).addTo(map);

        // 由于我们没有实际的瓦片图片，这里使用随机生成的图片作为示例
        // 在实际应用中，你需要将图片分割成瓦片并放置在对应的目录结构中
        tileLayer.getTileUrl = function (coords) {
            // 计算瓦片在原始图片中的位置
            const zoom = coords.z;
            const x = coords.x;
            const y = coords.y;
            console.log("fffffff", coords);

            // 生成随机图片作为示例瓦片
            // 实际应用中应返回真实的瓦片路径
            return `https://picsum.photos/seed/${x}${y}${zoom}/${tileSize}/${tileSize}`;
        };

        // 设置地图初始视图，显示整个图片
        map.fitBounds(bounds);

        // 绑定控制按钮事件
        // document.getElementById("zoomIn").addEventListener("click", () => {
        //     map.zoomIn();
        // });

        // document.getElementById("zoomOut").addEventListener("click", () => {
        //     map.zoomOut();
        // });

        // document.getElementById("resetView").addEventListener("click", () => {
        //     map.fitBounds(bounds);
        // });

        // 添加一个标记点示例
        const marker = L.marker(map.unproject([imageWidth / 2, imageHeight / 2], map.getMaxZoom())).addTo(map);
        marker.bindPopup("<b>图片中心点</b><br>这是一个标记点示例").openPopup();

        // 添加一个矩形覆盖物示例
        const rectangle = L.rectangle(
            [
                map.unproject([imageWidth / 4, (imageHeight / 4) * 3], map.getMaxZoom()),
                map.unproject([(imageWidth / 4) * 3, imageHeight / 4], map.getMaxZoom()),
            ],
            { color: "red", weight: 2, fillOpacity: 0.1 }
        ).addTo(map);
        rectangle.bindPopup("这是一个矩形覆盖物示例");
    }, []);

    return <div id="ro-leaflet-map-tie"></div>;
}
