// src/layouts/Frame.js
import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Weekly from '@src/components/Weekly';
import Detail from '@src/components/Detail';
import Slide from './Slide';

const Frame = () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path='/' component={Weekly} />
                <Route path='/detail/:id' component={Detail} />
            </Switch>
            <Slide />
        </div>
    </BrowserRouter>
);

export default Frame;
