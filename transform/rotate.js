import { rotateGrip, scaleGrips, svgRoot } from "../canvas.js";
import { getSeleted } from "../global.js";
import { showSelectedBox } from "../util.js";
import { defaultTransform } from "./default.js";



/**
 * 控制点的旋转。
 */
const rotateParams = {
    active: false,
    center: undefined,
    angle: 0,
    m: undefined,
    
}

const mousedown = function (e) {
    return;
    // 中心旋转。
    const target = e.target;
    
    if (target !== rotateGrip.node) return;
    // calAngle(e.offsetX, e.offsetY,)
    rotateParams.active = true;

    // 获取旋转中心坐标。
    rotateParams.center = rotateUtil.getCenterCoordInRoot();
    // svgRoot.circle(10).center(rotateParams.center.x, rotateParams.center.y);

    rotateUtil.calAngle(e.offsetX, e.offsetY, rotateParams.center.x, rotateParams.center.y);

    const seleted = getSeleted();
    console.log(seleted)

    rotateParams.m = seleted.attr('transform') || defaultTransform;
    rotateParams.angle = seleted.transform('rotation');
}

const mousemove = function(e) {
    if (!rotateParams.active) return;
    // 计算旋转角度。
    // 计算中心点。
    
    const currAngle = rotateUtil.calAngle(e.offsetX, e.offsetY, rotateParams.center.x, rotateParams.center.y);
    const dRot = ( currAngle - rotateParams.angle + 360) % 360;

    // console.log(dRot);

    // 修改 transform 属性。
    const seleted = getSeleted();
    // seleted.attr('transform', rotateParams.m);
    // seleted.transform({rotation: dRot}, true)
    rotateUtil.setRotate(seleted, rotateParams.m, currAngle);
    showSelectedBox(seleted);
}


const mouseup = function(e) {
    rotateParams.active = false;
}

const rotateUtil = {

    // getTransformObj() {
    //     // 自然数的正则表达式： /\d(\.\d+)?/
    //     const pattern = /((rotate)\(()\))/;
        
    // },

    setRotate(el, m, rot) {
        // 修改 transform 字符串里面的 rotate 参数
        // cx , cy 默认为 bbox 中心。
        const {cx, cy} = el.bbox();
        // const rot = el.transform('rotation') + dRot;

        // 分解 m
        

        const r = `rotate(${rot}, ${cx}, ${cy})`
        el.attr('transform', [r, m].join(' '))
    },

    getCenterCoordInRoot() {
        const p = scaleGrips[0],
              p2 = scaleGrips[4];
        return {
            x: (p.cx() + p2.cx())/ 2,
            y: (p.cy() + p2.cy())/ 2
        }
    },

    // 计算旋转完后的角度。

    // 计算向量 (x-cx, y-cx) 和 y 轴负方向（0，-1）的夹角。角度的取值范围为 (-180, 180]
    calAngle(x, y, cx, cy) {
        const radian = this.getCosBy2pt(x, y, cx, cy);
        let angle = Math.acos(radian) * 180 / Math.PI;

        if (x < cx) angle = -angle;
        // console.log(angle)
        return angle;
    },

    // 计算 点1指点2形成 的向量 
    getCosBy2pt(x, y, cx, cy) {
        // 点积公式
        let a = [x - cx, y - cy];
        let b = [0, -1];
        return this.calCos(a, b);
    },
    calCos(a, b) {
        let dotProduct = a[0] * b[0] + a[1] * b[1];
        let d = Math.sqrt(a[0] * a[0] + a[1] * a[1]) * Math.sqrt(b[0] * b[0] + b[1] * b[1]);
        return dotProduct/d;
    }
}





svgRoot.node.addEventListener('mousedown', mousedown);
svgRoot.node.addEventListener('mousemove', mousemove);
svgRoot.node.addEventListener('mouseup', mouseup)