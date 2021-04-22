module.exports = function(content, map, mate) {
    debugger
    console.log("content 222", content)
    console.log("this.data", this.data)
    return content;
}

module.exports.pitch = function(a, b, data) {
    console.log("pitch loader2")
    data.value = "woaini"
}