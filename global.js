
let selected = null;

export const setSeleted = (el) => {
    // if (!el) return null;
    if (el instanceof SVGElement) selected = SVG.adopt(el)
    else selected = el;
    return selected;
}

export const getSeleted = () => {
    return selected;
}