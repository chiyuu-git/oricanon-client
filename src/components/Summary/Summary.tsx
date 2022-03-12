import React, { useEffect, useMemo, useRef, useState } from 'react';

import TwitterFollowerBarRace from './BarRace/TwitterFollower';
import LineRace from './LineRace/LineRace';
import GroupedBar from './GroupedBar/GroupedBar';

const Summary = () => {
    const placeholder = 123;

    return (
        <div>
            <TwitterFollowerBarRace />
            {/* <LineRace />
            <GroupedBar /> */}
        </div>
    );
};

export default Summary;
