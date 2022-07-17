import React, { FC, useEffect, useState } from 'react';
import { Category, ProjectName } from '@common/root';
import { CharaMemberIncrementInfo } from '@common/summary';
import { reqProjectRelativeIncrementInfo } from '@src/api';
import { Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

import './Couple.less';

import { CoupleRecordType } from '@common/record';

interface DataType {
    name: string;
    pixivTag: string;
    pixivReverseTag: number;
    pixiv_illust: number;
    pixiv_illust_reverse: number;
    pixiv_illust_intersection: number;
    pixiv_novel: number;
    pixiv_novel_reverse: number;
    pixiv_novel_intersection: number;
    pixiv_tag_view: number;
    pixiv_tag_view_reverse: number;
    pixiv_illust_with_novel: number;
    pixiv_couple_union_illust: number;
    pixiv_couple_union_novel: number;
}

const dimensionList = [
    CoupleRecordType.illust,
    CoupleRecordType.illustReverse,
    CoupleRecordType.illustIntersection,
    CoupleRecordType.novel,
    CoupleRecordType.novelReverse,
    CoupleRecordType.novelIntersection,
    CoupleRecordType.tagView,
    CoupleRecordType.tagViewReverse,
    CoupleRecordType.illustWithNovel,
    CoupleRecordType.coupleUnionIllust,
    CoupleRecordType.coupleUnionNovel,
];

const paginationProps = {
    disabled: true,
    hideOnSinglePage: true,
    pageSize: 36,
    current: 1,
    total: 1,
};

const columns: ColumnsType<DataType> = [

    {
        title: 'memberId',
        dataIndex: 'memberId',
    },
    {
        title: 'name',
        dataIndex: 'name',
        sorter: (a: any, b: any) => a.memberA.length - b.memberA.length,
    },
    // {
    //     title: 'memberA',
    //     dataIndex: 'memberA',
    //     sorter: (a: any, b: any) => a.memberA.length - b.memberA.length,
    // },
    // {
    //     title: 'memberB',
    //     dataIndex: 'memberB',
    //     sorter: (a: any, b: any) => a.memberB.length - b.memberB.length,
    // },
    // {
    //     title: 'pixivTag',
    //     dataIndex: 'pixivTag',
    //     align: 'center',
    // },
    // {
    //     title: 'pixivReverseTag',
    //     dataIndex: 'pixivReverseTag',
    // },
    ...dimensionList.map((dimension) => ({
        title: dimension.slice(6),
        dataIndex: dimension,
        defaultSortOrder: (dimension === CoupleRecordType.illustWithNovel ? 'descend' : '') as any,
        sorter: (a: any, b: any) => a[dimension] - b[dimension],
    })),
];

const MonthlyCouple: FC<unknown> = function () {
    const [coupleIncrementInfo, setIncrementInfo] = useState<CharaMemberIncrementInfo[] | null>(null);
    useEffect(() => {
        async function getInfo() {
            const incrementInfo = await reqProjectRelativeIncrementInfo(
                Category.couple,
                ProjectName.llss,
                '2021-01-01',
            );
            for (const info of incrementInfo) {
                const [memberA, memberB] = info.name.split('_');
                (info as any).memberA = memberA;
                (info as any).memberB = memberB;
            }
            setIncrementInfo(incrementInfo);
        }
        getInfo();
    }, []);
    if (!coupleIncrementInfo) {
        return (
            <div>
                couple
            </div>
        );
    }

    return (
        <div>
            <Table
                columns = {columns}
                dataSource = {coupleIncrementInfo as any}
                pagination = {paginationProps}
                scroll = {{ y: '90vh' }}
            />
        </div>
    );
};

export default MonthlyCouple;
