


// 包装一下。
class Action {
    constructor(params) {
        // this.mousedown = 
    }

    // 也可以手动挂载。
    on(eventName, handler) {

    }
}



// 使用方式。
new Action({
    mousedown(e) {
        // 这个 e 是经过包装的。。

    }
})
