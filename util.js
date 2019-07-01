import { selectedBox, selectedBoxOutline, draw, svgContent, scaleGrips, rotateGrip } from "./canvas.js";


export const showSelectedBox = (el) => {
    if (el == null) return console.error('showSelectedBox 函数传入的参数不能为 null');
    hideSelectedBox();

    const bbox = el.bbox(),   // 获取节点的 bbox 对象。
          matrix = el.transform(),
          tbox = transformBox(bbox, matrix);

    // 此时 tbox 的坐标是 svgContent 系的，需要转为 svgroot 坐标系的坐标。
    tbox.p1 = parseCanvasCoord(tbox.p1);
    tbox.p2 = parseCanvasCoord(tbox.p2);
    tbox.p3 = parseCanvasCoord(tbox.p3);
    tbox.p4 = parseCanvasCoord(tbox.p4);

    // 计算 旋转控制点。。

    const rotP = parseCanvasCoord(transformPoint(
       bbox.x + bbox.w / 2,
       bbox.y - bbox.w / 3,
       matrix
    ));

    drawOutline(tbox);      // 绘制选中框矩形轮廓线。
    drawScaleGrip(tbox);         // 绘制缩放控制点。
    drawRotateGrip(rotP)
    

}


const drawScaleGrip = tbox => {
    const {p1, p2, p3, p4} = tbox;
    const coords = [  
        [p1.x, p1.y],
        getMidPoint(p1, p2),
        [p2.x, p2.y],
        getMidPoint(p2, p3),
        [p3.x, p3.y],
        getMidPoint(p3, p4),
        [p4.x, p4.y],
        getMidPoint(p4, p1),
    ];
    coords.forEach((item, i) => {
        // showOneSelectorGrip(item[0], item[1], `grip_dir-${index}`);
        scaleGrips[i].center(item[0], item[1]).show();
    })
} 

const drawRotateGrip = (p) => {
    rotateGrip.center(p.x, p.y).show();
}
/* const calRotateGrapCoord = (coords) => {
    // Vertical
    const x = coords[0][0] - coords[2][0],
          y = coords[0][1] - coords[2][1];
    
} */



const drawOutline = tbox => {
    const {p1, p2, p3, p4} = tbox;
    selectedBoxOutline
        .show()
        .plot([
            p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y 
        ])
        
}

// 返回数组形式的坐标值。
const getMidPoint = (p, p2) => {
    return [
        (p.x + p2.x) / 2,
        (p.y + p2.y) / 2
    ]
}

const hideSelectedBox = () => {
    selectedBox.each(function() {
        this.hide();
    })
}


const transformBox = function (bbox, m) {
    // 左上角顺时针 依次。
    const {x, y, w, h} = bbox;
    const p1 = transformPoint(x, y, m),
        p2 = transformPoint(x + w, y, m),
        p3 = transformPoint(x + w, y + h, m),
        p4 = transformPoint(x, y + h, m);
    
        /* minx = Math.min(p1.x, p2.x, p3.x, p4.x),
        maxx = Math.max(p1.x, p2.x, p3.x, p4.x),
        miny = Math.min(p1.y, p2.y, p3.y, p4.y),
        maxy = Math.max(p1.y, p2.y, p3.y, p4.y); */
  
    return {
        p1,
        p2,
        p3,
        p4,
        /* aabox: {
            x: minx,
            y: miny,
            width: (maxx - minx),
            height: (maxy - miny)
        } */
    };
}

export const transformPoint = function (x, y, m) {
    return {x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f};
}

const parseCanvasCoord = point => {
    const x = point.x * svgContent.viewbox().zoom + svgContent.x();
    const y = point.y * svgContent.viewbox().zoom + svgContent.y();
    return {x, y};
};






/*** 坐标转换 ***/
export const coord = {
    toContent(p) {
        const zoom = svgContent.viewbox().zoom;
        const x = (p.x - svgContent.x()) / zoom ;
        const y = (p.y - svgContent.y()) / zoom ;
        return {x, y};
    },
    /* toRoot () {
        const zoom = svgContent.viewbox().zoom;
        const x = p.x + svgContent.x();
        const y = p.y / zoom - svgContent.y();
        return {x, y};
    }, */

    getZoom() {}
}