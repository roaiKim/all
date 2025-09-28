import { useEffect } from "react";
import Leaflet from "leaflet";
import "./index.less";

const imageConfig = {
    // 示例图片 - 可以替换为您自己的图片URL
    url: "https://picsum.photos/id/1015/2000/1500", // 2000x1500的风景图片
    width: 2000, // 图片实际宽度（像素）
    height: 1500, // 图片实际高度（像素）
    minZoom: 0.1, // 最小缩放级别
    maxZoom: 5, // 最大缩放级别
    initialZoom: 0.5, // 初始缩放级别
};

class ImageMosaic {
    constructor(map, imagesConfig) {
        this.map = map;
        this.images = imagesConfig;
        this.layers = [];
        this.group = Leaflet.layerGroup().addTo(map);
    }

    addImage(image) {
        const { url, position, width, height, title } = image;

        // 计算图片边界
        const bounds = [
            [position.y, position.x],
            [position.y + height, position.x + width],
        ];
        console.log(bounds);
        const layer = Leaflet.imageOverlay(url, bounds, {
            attribution: title,
        }).addTo(this.group);

        this.layers.push(layer);
        return layer;
    }

    loadAllImages() {
        this.images.forEach((image) => this.addImage(image));
        this.fitToAllImages();
    }

    fitToAllImages() {
        const allBounds = this.layers.reduce((bounds, layer) => {
            return bounds.extend(layer.getBounds());
        }, Leaflet.latLngBounds());

        this.map.fitBounds(allBounds, { padding: [20, 20] });
    }

    removeAllImages() {
        this.group.clearLayers();
        this.layers = [];
    }
}

function LeafletContainer() {
    useEffect(() => {
        // https://leafletjs.cn/reference.html#map-option
        const map = Leaflet.map("ro-leaflet-map", {
            center: [0, 0],
            zoom: 10,
            zoomSnap: 0.5,
            maxZoom: 10,
            attributionControl: false,
        });
        // const greenIcon = Leaflet.icon({
        //     iconUrl: "/static/image/tile_0_0.webp",
        //     // iconSize: [256, 256], // size of the icon
        // });
        // Leaflet.marker([0, 0], { icon: greenIcon }).addTo(map);
        const imgs = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j <= 9; j++) {
                imgs.push({
                    url: `/static/image/tile_${i}_${j}.webp`,
                    position: { x: j * 256, y: i * 256 },
                    width: 256,
                    height: 256,
                });
            }
        }
        console.log("imgs", imgs);
        const mosaic = new ImageMosaic(map, imgs);

        mosaic.loadAllImages();
    }, []);
    return <div id="ro-leaflet-map"></div>;
}

export default LeafletContainer;
