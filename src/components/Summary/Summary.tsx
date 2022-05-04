import React, { useEffect, useMemo, useRef, useState } from 'react';

import LineRace from '@components/commom/LineRace';
import TwitterFollowerBarRace from './BarRace/TwitterFollower';
import ProjectMemberLine from '../commom/Line';
import GroupedBar from './GroupedBar/GroupedBar';

const Summary = () => {
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
