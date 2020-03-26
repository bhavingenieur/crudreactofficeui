import React, { Fragment } from 'react';
import './App.css';
import { Stack, IStackProps } from 'office-ui-fabric-react/lib/Stack';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, LoginCallback } from '@okta/okta-react';
import Home from './Home';
import ScheduleEditor from './ScheduleEditor'

const config = {
  issuer: 'https://dev-674282.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '0oa4fx7b4d788BltL4x6',
  pkce: true
};


export default class App extends React.Component {
  constructor(props){
    super(props);
    
}

  render() {
  return (
      <Fragment>
      <h1>GranTurismo</h1>
      
      <Router>
        <Security {...config}>
        
          <Route path='/' exact={true} component={Home}/>
          <Route path='/implicit/callback' component={LoginCallback}/>
        </Security>
      </Router>
      </Fragment>
    );
  
}
}