import { enhanceFetch } from './fetch';

/**
 * 查询周榜所需的数据
 * 不需要任何参数，后端直接返回周榜所需要的全部数据
 *
 * @returns
 */
export const reqWeeklyInfo = () => enhanceFetch('/api/weekly/weekly_info');
