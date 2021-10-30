export const toolbox = {
    // show为显示工具栏
    show: true,
    // feature里面放的是工具栏元素
    feature: {
        // 控制图表的区域放大  需要鼠标拖拽
        // dataZoom: {
        //     yAxisIndex: 'none', // yAxisIndex  代表横向放大
        //     xAxisIndex: 'none', // xAxisIndex  代表纵向放大
        // },
        // dataView
        // dataView: {
        //     // readOnly为是否为不可编辑只读状态  true为只读   false为可编辑
        //     readOnly: false,
        // },
        // magicType 为动态类型切换
        // magicType: {
        //     // type为需要切换的类型集合
        //     type: ['line', 'bar', 'stack'] as const,
        // },
        // restore为还原按钮
        // restore: {},
        // saveAsImage下载图片
        saveAsImage: {
            show: true,
            type: 'png',
            pixelRatio: 10,
        } as const,
    },
};
