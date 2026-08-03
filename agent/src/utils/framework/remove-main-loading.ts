export function removeMainLoading() {
    const iframe = document.getElementById("main-loading-iframe");
    if (iframe) {
        iframe.remove();
    }
}
