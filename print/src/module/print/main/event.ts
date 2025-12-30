// import type { WebPrint } from "./print";
// import { PositionManager } from "../utils/position-manager";
// import { UidManager } from "../utils/tool-manager";

// interface EventProps {
//     base: any[];
//     auxiliary: any[];
//     other: any[];
//     custom: any[];
// }

// export class CustomDragEvent {
//     listeners: any[];
//     constructor(
//         private printModule: WebPrint,
//         private dragTarget
//     ) {
//         this.listeners = [];
//     }

//     getPrint() {
//         return this.printModule;
//     }

//     mousedown() {
//         console.log("----");
//         if (this.dragTarget) {
//             const mousedown = (event) => {
//                 this.printModule.dragStart(event);
//             };
//             this.addEventListener(this.dragTarget, "mousedown", mousedown);
//         }
//     }

//     mousemove() {
//         if (this.dragTarget) {
//             const mousemove = (event) => {
//                 this.printModule.draging(event);
//             };
//             this.addEventListener(this.dragTarget, "mousemove", mousemove);
//         }
//     }

//     mouseup() {
//         if (this.dragTarget) {
//             const mouseup = () => {
//                 this.printModule.dragEnd();
//             };
//             this.addEventListener(this.dragTarget, "mouseup", mouseup);
//         }
//     }

//     start = (event) => {
//         const state = 1;
//         // setPrintTemporaryTemplate(state);
//     };

//     addEventListener(target: HTMLElement, name, listener: EventListenerOrEventListenerObject) {
//         if (target && name && listener) {
//             target.addEventListener(name, listener);
//             this.listeners.push({ target, name, listener });
//         }
//     }

//     removeEventListener(target: HTMLElement, name, listener: EventListenerOrEventListenerObject) {
//         if (target && name && listener) {
//             target.removeEventListener(name, listener);
//         }
//     }

//     destroy() {
//         if (this.listeners?.length) {
//             this.listeners.forEach((item) => {
//                 const { target, name, listener } = item;
//                 this.removeEventListener(target, name, listener);
//             });
//         }
//     }
// }
