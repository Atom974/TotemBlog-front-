import React from 'react';
 import { Route, Redirect } from 'react-router-dom';
 import AuthenticationService from './services/authentication-services';
 import { get } from "local-storage";
  
const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={(props) => {
    const user = get('user') || '';
    if (user) 
      AuthenticationService.isAuthenticated = true;
    const isAuthenticated = AuthenticationService.isAuthenticated;
    if (!isAuthenticated) {    
      return <Redirect to={{ pathname: '/login' }} />
    }
  
    return <Component {...props} />
  }} />
);
  
export default PrivateRoute; 