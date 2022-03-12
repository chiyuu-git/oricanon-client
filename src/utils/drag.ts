/* eslint-disable no-param-reassign */
interface TransformNode extends HTMLElement {
    transform?: Record<string, number>;
}

/**
 * style transform 读写函数
 */
function accessTransform(node: TransformNode, prop: string, val?: undefined): number
function accessTransform(node: TransformNode, prop: string, val: number): string
function accessTransform(node: TransformNode, prop: string, val?: number | undefined) {
    // 如果还没有transform对象，创建一个
    if (!node.transform) {
        node.transform = {};
    }
    let transformStyleText = '';
    // val是否有值？有则是写操作，没有则是读操作
    if (val) {
        // 写操作，修改prop
        node.transform[prop] = val;
        // 遍历输出 transform text
        for (const [key, value] of Object.entries(node.transform)) {
            switch (key) {
                case 'translateX':
                case 'translateY':
                    transformStyleText += `${key}(${value}px)`;
                    break;
                case 'rotate':
                    transformStyleText += `${key}(${value}deg)`;
                    break;
                case 'scale':
                    transformStyleText += `${key}(${value})`;
                    break;
                default:
            }
        }
        // 赋值
        node.style.transform = transformStyleText;
        return transformStyleText;
    }

    // 读操作
    let res = node.transform[prop];
    // 判断 val 是否有值，如果没有值，返回属性的默认值
    if (!res) {
        switch (prop) {
            case 'translateX':
            case 'translateY':
            case 'rotate':
                res = 0;
                break;
            case 'scale':
                res = 1;
                break;
            default:
        }
    }
    return res;
}

/**
 * 拖拽功能的配置对象
 */
interface DragOption {
    /**
     * x轴是否可以移动
     */
    x: boolean;
    /**
     * y轴是否可以移动
     */
    y: boolean;
    /**
     * 是否可以拖拽到容器外
     */
    overflow: boolean;
}

/**
 * 实现容器范围内目标节点的拖拽功能
 * 如何保证inner只在容器内滑动？首先把事件添加给容器，还要做超出限制
 */
export function drag(
    container: HTMLElement,
    inner: HTMLElement,
    options?: DragOption,
) {
    const defaults = {
        x: true,
        y: false,
        overflow: true,
    };
    const dragOption = { ...defaults, ...options };
    // inner 当前的位置,距离container的偏移
    const elementOffset = { x: 0, y: 0 };
    // 手指当前的位置, 默认值为0, 初始化在点击 inner 时进行
    const fingerStart = { x: 0, y: 0 };
    // 初始化手指偏移量L
    const fingerOffset = { left: 0, top: 0 };
    // 默认情况下的最大偏移量，inner 默认与 container 左对齐
    // TODO: 实际上的偏移量应该是分为正负的，正向的最大偏移为 getBoundingRect(container.right - inner.right)
    const maxOffset = {
        left: container.offsetWidth - inner.offsetWidth,
        top: container.offsetHeight - inner.offsetHeight,
    };

    let isIndicatorClick = false;

    inner.addEventListener('mousedown', (e) => {
        isIndicatorClick = true;

        if (dragOption.x) {
            elementOffset.x = accessTransform(inner, 'translateX');
            fingerStart.x = e.clientX;
        }

        if (dragOption.y) {
            elementOffset.y = accessTransform(inner, 'translateY');
            fingerStart.y = e.clientY;
        }
    });

    container.addEventListener('mousemove', (e) => {
        if (!isIndicatorClick) {
            return;
        }

        // 求出手指的偏移量
        if (dragOption.x) {
            fingerOffset.left = e.clientX - fingerStart.x;
            // 容器内拖拽过程中，translateX是一个正数，[0, maxOffset.left]
            let translateX = elementOffset.x + fingerOffset.left;

            // 超出控制
            if (translateX < 0) {
                translateX = 0;
            }
            if (translateX > maxOffset.left) {
                translateX = maxOffset.left;
            }

            // 修改元素的位置
            accessTransform(inner, 'translateX', translateX);
        }

        if (dragOption.y) {
            fingerOffset.top = e.clientY - fingerStart.y;
            // 容器内拖拽过程中，translateY是一个正数，[0，maxOffset]
            let translateY = elementOffset.y + fingerOffset.top;

            if (translateY > maxOffset.top) {
                translateY = maxOffset.top;
            }
            if (translateY < 0) {
                translateY = 0;
            }

            accessTransform(inner, 'translateY', translateY);
        }
    });

    document.addEventListener('mouseup', () => {
        isIndicatorClick = false;
    });
}
