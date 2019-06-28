import { setSeleted, getSeleted } from "../global.js";
import { coord, showSelectedBox } from "../util.js";
import { svgRoot, svgContent } from "../canvas.js";


const moveParams = {
    originCoord: {
        x: undefined, y: undefined
    },
    originMatrix: undefined,
    active: false,
}

const mousedown = function (e) {
    const target = e.target;
    if (/* target.tagName !== 'rect' ||  */!moveUtil.isInSvgContent(target)) {
        // setSeleted(null);
        return;
    }
    moveParams.active = true;

    const seleted = setSeleted(target);
    showSelectedBox(seleted);

    Object.assign(moveParams.originCoord, coord.toContent({x: e.offsetX, y: e.offsetY}));
    moveParams.originMatrix = seleted.attr('transform') || 'matrix(1,0,0,1,0,0)';
}

const mousemove = function (e) {
    if (!moveParams.active) return;
    const p = coord.toContent({x: e.offsetX, y: e.offsetY});
    // svgContent.circle(10).center(p.x, p.y)
    const dx = p.x - moveParams.originCoord.x
    const dy = p.y - moveParams.originCoord.y
    
    const seleted = getSeleted();

    seleted.attr('transform', moveParams.originMatrix);   // 回归起点值。
    // seleted.transform({x: dx, y: dy}, true);
    moveUtil.translate(seleted, dx, dy);
    // seleted.translate(dx, dy)

    showSelectedBox(seleted);
}

const mouseup = function (e) {
    // setSeleted(null);
    moveParams.active = false;
}


// 移动，需要在 最前面加。。。

const moveUtil = {
    // 前置平移
    translate (el, x, y) {
        let m = el.transform();
        var translateM = new SVG.Matrix({ a: 1, b: 0, c: 0, d: 1, e: x, f: y });
        m = translateM.multiply(m);
        el.transform(m);
    }, 
    isInSvgContent(node) {
        if (node instanceof SVG.Element) node = node.node;
        while (node !== svgRoot.node) {
            if (node === svgContent.node) return true;
            node = node.parentElement;
        }
        return false;
    }
}



svgRoot.node.addEventListener('mousedown', mousedown);
svgRoot.node.addEventListener('mousemove', mousemove);
svgRoot.node.addEventListener('mouseup', mouseup);




/* 
var n={}    // n -> 内存对象A {}      
var m={}    // m -> 内存对象B {}
var n=m     // n -> 内存对象B{}（对象A没有任何变量引用，下一次垃圾回收会被收回）
m={username:1}      // m -> 内存对象C {username:1} 
console.log(n,m)    //打印的结果是n:{},m:{username:1} */

