// src/layouts/Frame.js
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Detail from '@src/components/Detail';
import MemberInfo from '@src/components/MemberInfo/MemberInfo';
import Slide from './Slide';

function Frame() {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path = '/' element = {<MemberInfo />} />
                </Routes>
                <Slide />
            </div>
        </BrowserRouter>
    );
}

export default Frame;
