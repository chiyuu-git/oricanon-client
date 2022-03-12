import { GraphSeriesOption } from 'echarts';

import { romaColorMap, KeyofRomaColorMap } from '@src/constant';
import { pipe } from '@src/utils';

/**
 * 根据 members 排列组合，返回一个二维数组
 */
function getCombinationMembers(members: readonly KeyofRomaColorMap[]) {
    return members.map((member, i) => {
        // 计算出要与多少名成员组合
        const target = members.slice(i + 1);
        const combination: NonNullable<GraphSeriesOption['links']> = [];
        if (target.length > 0) {
            for (const combineMember of target) {
                const item: (typeof combination)[number] = {
                    source: member,
                    target: combineMember,
                    lineStyle: {
                        width: 10,
                    },
                };
                combination.push(item);
            }
        }
        // 最后一个会是空数组，因为 ren 没有可以组合的对象， flat 后会自然消除
        return combination;
    });
}

/**
 * 有副作用，修改特定的 lineStyle ，画圆
 */
function decorateWithCircle(combinationMembers: ReturnType<typeof getCombinationMembers>) {
    return combinationMembers
        .flatMap((combinationMember, i) => {
            const couple = combinationMember;
            if (couple[0] && couple[0].lineStyle) {
                // 每个组合得第一个需要画圆
                // 边的曲度，支持从 0 到 1 的值，值越大曲度越大
                couple[0].lineStyle.curveness = 0.3;
            }
            if (i === 0) {
                // kanon 和 ren 需要把圆闭合
                const closeLineStyle = couple[couple.length - 1].lineStyle;
                if (closeLineStyle) {
                    closeLineStyle.curveness = -0.3;
                }
            }

            return couple;
        });
}

/**
 * 有副作用，修改特定的 lineStyle color
 */
function decorateWithColor(combinationMembers: ReturnType<typeof decorateWithCircle>) {
    // 渐变色设置，分别代表右下左上，需要每一条单独设定效果才好
    // 1代表开始的位置，0代表结束的位置
    const linearOptions = [
        // 从右下到左上
        { x: 1, y: 1, x2: 0, y2: 0 },
        { x: 0, y: 1, x2: 1, y2: 0 },
        { x: 0, y: 1, x2: 0, y2: 0 },
        { x: 0, y: 1, x2: 1, y2: 0 },
        { x: 0, y: 1, x2: 0, y2: 0 },
        { x: 0, y: 1, x2: 1, y2: 0 },
        { x: 0, y: 0, x2: 1, y2: 0 },
        { x: 0, y: 0, x2: 1, y2: 0 },
        { x: 0, y: 0, x2: 1, y2: 1 },
        { x: 0, y: 0, x2: 0, y2: 1 },
    ];

    return combinationMembers.map((combinationMember, i) => {
        const couple = combinationMember;
        const sourceColor = romaColorMap[couple.source as KeyofRomaColorMap];
        const targetColor = romaColorMap[couple.target as KeyofRomaColorMap];
        if (couple.lineStyle) {
            couple.lineStyle.color = {
                type: 'linear',
                ...linearOptions[i],
                colorStops: [
                    {
                        offset: 0.1,
                        color: sourceColor,
                    },
                    {
                        offset: 1,
                        color: targetColor,
                    },
                ],
            };
        }
        return couple;
    });
}

/**
 * 有副作用，指定 lineStyle width
 */
function decorateWithWidth(combinationMembers: ReturnType<typeof decorateWithCircle>) {
    // 按照占比来划分好了，目前可香占比超过了50%
    // 前三名单独width，中间五名递减width，最后2名统一为10
    const widthOptions = [35, 35, 15, 15, 10, 35, 10, 5, 15, 15];

    return combinationMembers.map((combinationMember, i) => {
        const couple = combinationMember;
        if (couple.lineStyle) {
            couple.lineStyle.width = widthOptions[i];
        }
        return couple;
    });
}

export const processMembers = pipe(
    decorateWithWidth,
    decorateWithColor,
    decorateWithCircle,
    getCombinationMembers,
);

