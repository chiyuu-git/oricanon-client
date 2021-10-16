// src/layouts/Frame.js
import React, { PureComponent } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Home from '@src/components/Home';
import Detail from '@src/components/Detail';
import Nav from './Nav';

class Frame extends PureComponent {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Nav />
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route path='/detail/:id' component={Detail} />
                        <Route path='/ome' component={Home} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default Frame;
