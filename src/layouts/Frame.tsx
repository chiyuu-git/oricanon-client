// src/layouts/Frame.js
import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Detail from '@src/components/Detail';
import MemberInfo from '@src/components/MemberInfo/MemberInfo';
import Slide from './Slide';

const Frame = () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path = '/' component = {MemberInfo} />
                <Route path = '/detail/:id' component = {Detail} />
            </Switch>
            <Slide />
        </div>
    </BrowserRouter>
);

export default Frame;
