```ts
class DPIManager {
  constructor() {
    this.currentDevicePixelRatio = window.devicePixelRatio || 1;
    this.dpi = 96 * this.currentDevicePixelRatio;
    this.callbacks = new Set();
    
    this.initEventListeners();
  }
  
  // 初始化事件监听器
  initEventListeners() {
    // 监听窗口大小变化
    window.addEventListener('resize', () => this.checkDPIChange());
    
    // 定期检查 DPI 变化
    setInterval(() => this.checkDPIChange(), 1000);
  }
  
  // 检查 DPI 是否变化
  checkDPIChange() {
    const newDevicePixelRatio = window.devicePixelRatio || 1;
    
    if (newDevicePixelRatio !== this.currentDevicePixelRatio) {
      this.currentDevicePixelRatio = newDevicePixelRatio;
      this.dpi = 96 * newDevicePixelRatio;
      
      // 通知所有回调函数
      this.notifyCallbacks();
    }
  }
  
  // 通知回调函数
  notifyCallbacks() {
    this.callbacks.forEach(callback => {
      callback({
        devicePixelRatio: this.currentDevicePixelRatio,
        dpi: this.dpi
      });
    });
  }
  
  // 添加 DPI 变化监听器
  onDPIChange(callback) {
    this.callbacks.add(callback);
    
    // 立即调用一次，提供当前 DPI 信息
    callback({
      devicePixelRatio: this.currentDevicePixelRatio,
      dpi: this.dpi
    });
    
    // 返回移除监听器的函数
    return () => this.callbacks.delete(callback);
  }
  
  // 获取当前 DPI 信息
  getCurrentDPI() {
    return {
      devicePixelRatio: this.currentDevicePixelRatio,
      dpi: this.dpi
    };
  }
  
  // 计算 mm 到 px 的转换（考虑当前 DPI）
  mmToPx(mm) {
    return mm * (this.dpi / 25.4);
  }
  
  // 计算 px 到 mm 的转换（考虑当前 DPI）
  pxToMm(px) {
    return px * (25.4 / this.dpi);
  }
}
```