/**
 * 入口文件
 */

import {draw} from './canvas.js'
import {showSelectedBox} from './util.js'
import './transform/move.js'
import './transform/rotate.js'
import './transform/scale.js'
// svg 编辑器环境变量。

const editor = {
    
}


// 画一个 path 元素。
/* const pathStr = `M161.25 80C190 57.5 261.25 85 223.75 127.5C155 176.25 252.5 197.5 257.5 212.5C262.5 227.5 178.75 253.75 126.25 222.5C73.75 191.25 132.5 102.5 161.25 80Z`;
const path = draw.path(pathStr)
                    // .fill('#999')
                    .stroke({width: 2, color: '#000'}) */
                    // .transform({rotation: 40});

;

const rect = draw.rect(220, 150)
                .fill('#666')
                .stroke('#666')
                .move(130, 100)
                //  .transform({rotation: 40});

const pattern = draw.rect(220, 150)
                .fill('none')
                .stroke('#f04')
                .move(0, 0)
// const img = draw.image('/static/pika.jpg').move(200, 200)

/* var pattern = draw.pattern(100, 100, function(add) {
    // add.rect(20,20).fill('#f06')
    // add.rect(10,10)
    // add.rect(10,10).move(10,10)
    add.image('/static/pika.jpg')
}) */
window.pattern = pattern;
// rect.fill(pattern)


// 显示 选中框。
// showSelectedBox(rect);