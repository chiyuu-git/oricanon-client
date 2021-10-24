import React, { FC, useState, useEffect } from 'react';
import { TotalRank } from './TotalRank.type';

import './RankTable.less';

interface RankTableProps {
    title: string;
    range: string;
    contentType: string;
    totalRank: TotalRank;
}

const RankTable: FC<RankTableProps> = ({ title, range, contentType, totalRank }) => {
    function renderTable() {
        const cell = totalRank.map(({ name, projectName, record, increase }, index) => (
            <li className = { `cell ${projectName}` } key = { name }>
                <span className = 'ranking'>{ index + 1 }</span>
                <img src = { `/api/assets/icon/${projectName}/${name}.png` } alt = { name } />
                <span className = 'name'>{ name }</span>
                <span className = 'record'>{ record }</span>
                <span className = 'increase'>({ increase })</span>
            </li>
        ));
        return <ul className = { `${contentType}-table-content` }>{ cell }</ul>;
    }
    return (
        <div className = 'rank-table-wrap'>
            <p className = 'table-title'>
                <span className = 'describe'>说明：排名-成员-累计-(周增)</span>
                <span className = 'title'>{ title }</span>
                <span className = 'range'>集计范围:{ range }</span>
            </p>
            { renderTable() }
        </div>
    );
};

export default RankTable;
