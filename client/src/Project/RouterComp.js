import React from 'react';
import { Switch, Route, Link} from 'react-router-dom'
import Login from './Login';
import Main from './Main';

const RouterComp = () => {
    return (
        <div>
            <Link to="/">   </Link>

            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/MainPage/:id" component={Main} />


            </Switch>

        </div>
    );
};

export default RouterComp;