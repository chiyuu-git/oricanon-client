/**
 * @file 封装 html2image 方法
 */
import html2canvas, { Options } from 'html2canvas';
import Canvas2Image from './canvas-to-image';

// 创建用于绘制的基础canvas画布
function createBaseCanvas(width: number, height: number, scale: number) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const context = canvas.getContext('2d');

    if (context) {
        // 关闭抗锯齿
        context.imageSmoothingEnabled = false;
        // context.scale(scale, scale);
    }

    return canvas;
}

/**
 * 基础版快照方案
 * @param {HTMLElement} container
 * @param {object} options html2canvas相关配置
 */
export function html2Image(container: HTMLElement, fileName: string, options?: Options) {
    // 设置放大倍数
    const scale = window.devicePixelRatio;

    // 传入节点原始宽高
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // 创建用于绘制的基础canvas画布
    const baseCanvas = createBaseCanvas(width, height, scale);

    // html2canvas配置项
    const ops = {
        scale,
        width,
        height,
        canvas: baseCanvas,
        useCORS: true,
        allowTaint: false,
        ...options,
    };

    return html2canvas(container, ops).then((canvas) => {
        const imageEl = Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height, fileName);
        return imageEl;
    });
}

