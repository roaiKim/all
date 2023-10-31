export default {
    install: (app, options) => {
        //
        app.config.globalProperties.$translate = (key="") => {
            //
            return key.split(".").reduce((p, n) => {
                if (p) return p[n];
            }, options)
        }
    }
}