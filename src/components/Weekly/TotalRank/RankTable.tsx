import React, { FC } from 'react';
import { thousandSplit } from '@src/utils';
import { ProjectColorMap } from '@src/constant';
import { getRGBList } from '@utils/color';
import { H1_FONT_SIZE, H3_FONT_SIZE } from '@src/constant/echarts-toolbox';
import { TotalRank } from './common';

import './RankTable.less';

interface RankTableProps {
    title: string;
    range: string;
    totalRank: TotalRank;
    layoutOption: {
        contentType: string;
        incrementNodeWidth: string;
    };
}

const RankTable: FC<RankTableProps> = function ({ title, range, layoutOption, totalRank }) {
    function renderTable() {
        const { contentType, incrementNodeWidth } = layoutOption;
        const cell = totalRank.map(({ name, projectName, record, increment }, index) => (
            <li
                className = 'cell'
                style = {{
                    backgroundColor: `rgba(${getRGBList(ProjectColorMap[projectName])}, 0.75)`,
                // backgroundColor: ProjectColorMap[projectName],
                }}
                key = {name}
            >
                <span className = 'ranking'>{index + 1}</span>
                <div
                    className = 'icon'
                    style = {{
                        backgroundImage: `url(/api/assets/icon/${projectName}/${name}.png)`,
                    }}
                />
                <span className = 'name'>{name}</span>
                <span className = 'record'>{thousandSplit(record)}</span>
                <span className = 'increment' style = {{ width: incrementNodeWidth }}>
                    ({thousandSplit(increment)})
                </span>
            </li>
        ));
        return <ul className = {`${contentType}-table-content`}>{cell}</ul>;
    }
    return (
        <div className = 'rank-table-wrap'>
            <p className = 'table-title'>
                <span className = 'describe' style = {{ fontSize: H3_FONT_SIZE }}>说明：排名-成员-累计-(周增)</span>
                <span className = 'title' style = {{ fontSize: H1_FONT_SIZE }}>{title}</span>
                <span className = 'range' style = {{ fontSize: H3_FONT_SIZE }}>
                    集计范围：{range}&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
            </p>
            {renderTable()}
        </div>
    );
};

export default RankTable;
