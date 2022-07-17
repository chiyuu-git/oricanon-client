import React, { FC } from 'react';

import LineRace from '@components/commom/LineRace';
import TwitterFollowerBarRace from './BarRace/TwitterFollower';
import ProjectMemberLine from '../commom/Line';
import GroupedBar from './GroupedBar/GroupedBar';

const Summary: FC<unknown> = function () {
    const placeholder = 123;

    return (
        <div>
            {/* <TwitterFollowerBarRace /> */}
            <LineRace />
            {/*  <GroupedBar /> */}
        </div>
    );
};

export default Summary;
