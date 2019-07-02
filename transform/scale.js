import { svgRoot, scaleGrips, svgContent } from "../canvas.js";
import { coord, transformPoint, showSelectedBox } from "../util.js";
import { getSeleted } from "../global.js";



const params = {
    // centerIndex
    // center_top,
    // center_in,
    // w,
    // h,
    // m,
    // mObj,
    active: false,
};

const mousedown = function (e) {
    const target = e.target;
    const index = util.getIndex(target.id);
    if (index === undefined) return;
    params.active = true;
    console.log(index)
    // 计算缩放中心点。
    const centerIndex = (index + 4 ) % 8;
    params.centerIndex = centerIndex;
    const center_top = util.getScaleGripCoord(centerIndex);    // _in 代表 svg 主体， _top 代表 root。
    params.center_top = center_top;
    params.center_in = util.getCtr(getSeleted(), centerIndex);
    console.log({
        center_top: center_top,
        center_in: params.center_in
    })

    // tranform 去掉后的坐标。

    params.m = getSeleted().attr('transform');
    params.mObj = getSeleted().transform().matrix;

    const p_ = util.getOCoord(scaleGrips[index].cx(), scaleGrips[index].cy(), params.mObj);
    params.w = p_.x - params.center_in.x;
    params.h = p_.y - params.center_in.y;

    // 计算原来的宽。
}

const mousemove = function (e) {
    if (!params.active) return;
    const x = e.offsetX,
          y = e.offsetY;

    
    const selected = getSeleted();
    selected.attr('transform', params.m);

/*     console.log({
        m: params.m,
        scaleX: w / params.w,
        scaleY: h / params.h,
        cx: params.center_in.x,
        cy: params.center_in.y,
    }) */

    console.log( util.getOCoord(x, y, params.mObj));


    // 计算去掉 transform 后的宽高。
    const p_ = util.getOCoord(x, y, params.mObj); 
    const w = p_.x - params.center_in.x,
          h = p_.y - params.center_in.y;
    selected.transform({
        scaleX: w / params.w,
        scaleY: h / params.h,
        // cx: selected.bbox().x,
        // cy: selected.bbox().y,
        cx: params.center_in.x,
        cy: params.center_in.y,
    }, true);
    // util.dscale(selected, w / params.w, h / params.h, params.center_in.x, params.center_in.y)
    // util.dscale(selected, w / params.w, h / params.h, selected.bbox().x, selected.bbox().y)
    showSelectedBox(selected);
} 

const mouseup = function (e) {
    if (!params.active) return;
    
    params.active = false;
    const selected = getSeleted();
    selected.attr('transform', params.m);

    const x = e.offsetX,
          y = e.offsetY;
    const p_ = util.getOCoord(x, y, params.mObj); 
    const w = p_.x - params.center_in.x,
          h = p_.y - params.center_in.y;

    const scaleX = w / params.w,
          scaleY = h / params.h;
    // 修正 x y 和 width height
    // if 

    let newWidth = selected.width() * scaleX;
    let newHeight = selected.height() * scaleY;
    console.log(params.centerIndex)

    let targetX = selected.x(),
        targetY = selected.y();
    if (params.centerIndex == 0) {
        
    }


    if (params.centerIndex == 2) {
        targetX -= selected.width() * ( scaleX - 1 ) 
        // targetY = selected.cy() + selected.height() * ( scaleY - 1 ) 
    }

    // 宽高如果为负数，就翻转。。。
    if (newWidth < 0 && newHeight < 0) {
        // 旋转。。。
        selected.transform({
            rotation: 180,
            cx: params.center_in.x,
            cy: params.center_in.y,
        }, true)
        newWidth = -newWidth;
        newHeight = -newHeight;
    } 

    else if (newHeight < 0) {
        console.log('执行')
        selected.transform({
            rotation: 180,
            cx: params.center_in.x,
            cy: params.center_in.y,
        }, true)

        selected.transform({
            scaleX: -1,
            cx: params.center_in.x,
            cy: params.center_in.y,
        }, true)
        newHeight = -newHeight; 
    }
/*     let rotation;
    if (newWidth < 0 && newHeight < 0) rotation = 180
    else if (newWidth < 0) rotation = 90;
    else if (newHeight < 0) rotation = -90;

    selected.transform({
        rotation,
        cx: params.center_in.x,
        cy: params.center_in.y,
    }, true);

    newWidth = Math.abs(newWidth)
    newHeight = Math.abs(newHeight) */

    console.log({
        newWidth,
        newHeight,
    })

    selected.width(newWidth);
    selected.height(newHeight);
    // selected.move(targetX, targetY);


    showSelectedBox(selected);
    // scale 的内容要转为 width

} 

const util = {
    getIndex(str) {
        const match = /^grip_dir-(\d+)$/.exec(str);
        if (!match) return undefined;
        else return parseInt(match[1]);
    },
    getScaleGripCoord(index) {
        const scaleGrip = scaleGrips[index];
        return {
            x: scaleGrip.cx(),
            y: scaleGrip.cy(),
        }
    },

    // 得到原始的坐标（去掉 transform 后的坐标）
    getOCoord(x, y, m) {
        const coord_ = coord.toContent({x, y});     
        return transformPoint(coord_.x, coord_.y, calInverseMatrix(m));

        function calInverseMatrix (obj) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            let m = svg.createSVGMatrix();
            if (!obj) return null;
            if (obj.a != undefined) m.a = obj.a;
            if (obj.b != undefined) m.b = obj.b;
            if (obj.c != undefined) m.c = obj.c;
            if (obj.d != undefined) m.d = obj.d;
            if (obj.e != undefined) m.e = obj.e;
            if (obj.f != undefined) m.f = obj.f;

            return m.inverse();
        }
    },

    getCtr(el, index) {
        let {x, y, w, h} = el.bbox();
        switch (index) {
            case 0:
                x = x;
                y = y;
                break;
            case 1:
                x = x + w / 2;
                y = y;
                break;
            case 2:
                x = x + w;
                y = y;
                break;            
            case 3:
                x = x + w;
                y = y + h / 2;
                break;            
            case 4:
                x = x + w;
                y = y + h;
                break;            
            case 5:
                x = x + 2 / w;
                y = y + h;
                break;            
            case 6:
                x = x;
                y = y + h;
                break;            
            case 7:
                x = x;
                y = y + h / 2
                break;
        }
        return {x, y}
    },

    // dscale 和 dscale2 方法废弃
    dscale(el, sx, sy, cx, cy) {
        let m = el.attr('transform');
        const translateM = `translate(${-cx}, ${-cy})`,
              translateM2 = `translate(${cx}, ${cy})`,
              scaleM = `scale(${sx}, ${sy})`;

        el.attr('transform', [m , translateM , scaleM , translateM2].join(' '))
    },
    // 相对缩放
    dscale2(el, sx, sy, cx, cy) {
        // 移动 -cx, -cy
        let m = el.transform().matrix;
        let translateM = new SVG.Matrix(1, 0, 0, 1, -cx, -cy),
            translateM2 = new SVG.Matrix(1, 0, 0, 1, cx, cy),
            scaleM = new SVG.Matrix(sx, 0, 0, sy, 0, 0);
        // scaleM.scale(sx, sy);

        /* m = translateM.multiply(m)
                      .multiply(scaleM)
                      .multiply(translateM2);
         */

        m = m.multiply(translateM)
            .multiply(scaleM)
            .multiply(translateM2)

        // 难点，如何回到原来的位置。。。
        el.transform(m);
        // el.translate(cx, cy)
    }
}

svgRoot.node.addEventListener('mousedown', mousedown);
svgRoot.node.addEventListener('mousemove', mousemove);
svgRoot.node.addEventListener('mouseup', mouseup)