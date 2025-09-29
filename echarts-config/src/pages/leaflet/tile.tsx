import { useEffect } from "react";
import L from "leaflet";

const CRSOriginByLeftTop = L.extend({}, L.CRS.Simple, {
    /**
     * 将地理坐标转换为像素坐标
     * @param {L.LatLng} latLng - 地理坐标
     * @param {Number} zoom - 缩放级别
     * @returns {L.Point} 像素坐标
     */
    latLngToPoint(latLng, zoom) {
        const scale = this.scale(zoom);
        return L.point(
            (latLng.lng - this.transformation.x) * scale,
            (latLng.lat - this.transformation.y) * scale // y轴向下
        );
    },

    /**
     * 将像素坐标转换为地理坐标
     * @param {L.Point} point - 像素坐标
     * @param {Number} zoom - 缩放级别
     * @returns {L.LatLng} 地理坐标
     */
    pointToLatLng(point, zoom) {
        const scale = this.scale(zoom);
        return L.latLng(
            point.y / scale + this.transformation.y, // y轴向下
            point.x / scale + this.transformation.x
        );
    },
});

export default function Tile() {
    useEffect(() => {
        const map = L.map("ro-leaflet-map-tie", {
            crs: L.CRS.Simple, // 使用简单坐标系，适合图片拼接
            minZoom: 0,
            maxZoom: 3,
            maxBounds: L.latLngBounds(
                L.latLng(64, -64), // 西南角坐标
                L.latLng(-(1280 + 64), 2560 + 64) // 东北角坐标
            ),
            maxBoundsViscosity: 0.8,
            // zoomControl: false, // 禁用默认缩放控件
        });

        // 添加自定义缩放控件到右上角
        L.control
            .zoom({
                position: "topright",
            })
            .addTo(map);

        // 定义图片尺寸和瓦片信息
        // 这里我们使用一个虚拟的大图片，实际应用中需要替换为你的图片尺寸
        const imageWidth = 2560;
        const imageHeight = 1280;
        const tileSize = 64; // 瓦片大小，通常为256x256像素
        // map.setMaxBounds([
        //     [0, 0],
        //     [imageHeight, imageWidth],
        // ]);
        // 计算图片的边界
        const southWest = map.unproject([0, imageHeight], map.getMaxZoom());
        const northEast = map.unproject([imageWidth, 0], map.getMaxZoom());
        const bounds = new L.LatLngBounds(southWest, northEast);

        // 创建自定义瓦片图层
        const tileLayer = L.tileLayer("/tiles/{z}/{x}/{y}.png", {
            tms: true, // 使用TMS瓦片编号方式
            // bounds,
            tileSize,
            minZoom: 0,
            maxZoom: 3,
            attribution: "图片拼接技术演示 &copy; Leaflet.js",
        }).addTo(map);
        // tileLayer.on("tileerror", function (event) {
        //     console.error("瓦片加载错误:", event);
        // });
        // tileLayer.on("errorOverlayUrl", function (event) {
        //     console.info("s:", event);
        // });
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
            return `/static/image/tiles_64x64_webp/tile_${y}_${x}_64x64.webp`;
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
        // const marker = L.marker(map.unproject([imageWidth / 2, imageHeight / 2], map.getMaxZoom())).addTo(map);
        // marker.bindPopup("<b>图片中心点</b><br>这是一个标记点示例").openPopup();

        // // 添加一个矩形覆盖物示例
        // const rectangle = L.rectangle(
        //     [
        //         map.unproject([imageWidth / 4, (imageHeight / 4) * 3], map.getMaxZoom()),
        //         map.unproject([(imageWidth / 4) * 3, imageHeight / 4], map.getMaxZoom()),
        //     ],
        //     { color: "red", weight: 2, fillOpacity: 0.1 }
        // ).addTo(map);
        // rectangle.bindPopup("这是一个矩形覆盖物示例");
    }, []);

    return <div id="ro-leaflet-map-tie"></div>;
}
