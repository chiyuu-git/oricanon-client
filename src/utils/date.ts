/**
 * @file 日期相关的工具函数
 * TODO: dateString 和 Date 实例用哪个好呢？
 * 如果是用 dateString 每次日期相关的操作都需要转换成 Date 实例
 * 如果是 Date 实例 mysql 存储起来不方便，用日期为key时取值也不方便
 */

/**
 * 返回 YYYY-MM-DD 类型的字符串
 */
export const formatDate = function (dateStr: string | Date): string {
    const date = new Date(dateStr);
    return date.toJSON().split('T')[0];
};

/**
 * 返回两个日期相差天数的绝对值
 */
export const getDayDifferent = function (dateStrA: string | Date, dateStrB: string | Date): number {
    const dateA = new Date(dateStrA);
    const dateB = new Date(dateStrB);
    // 两个日期相差的毫秒数
    const different = dateA.getTime() - dateB.getTime();
    // 返回相差了多少天
    return Math.abs(different / 1000 / 60 / 60 / 24);
};
