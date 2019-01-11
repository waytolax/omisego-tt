import React from 'react';
import styled from 'styled-components/macro';
import {
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import './css/normalize.css';
import './css/global.css';
import StepOne from './Pages/StepOne';
import StepTwo from './Pages/StepTwo';

const Wrapper = styled.div `
    min-height: 100vh;
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 50px 5px;
    background: linear-gradient(90deg, #fd8355 0%, #f0576c 37%, #f79cbd 100%);
`;

const App = (props) => {
    return (
        <Wrapper>
            <Switch>
                <Route path="/stepone" component={StepOne}/>
                <Route path="/steptwo" component={StepTwo} />
                <Redirect to={'/stepone'} />
            </Switch>
        </Wrapper>
    );
}

export default App;