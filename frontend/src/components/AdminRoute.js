import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
        const isAdmin = !!(userInfo && (
          userInfo.isAdmin === true ||
          userInfo.user?.isAdmin === true ||
          userInfo.role === 'admin' ||
          userInfo.role === 'ADMIN'
        ));

        if (!isAdmin) {
          return <Redirect to="/login" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default AdminRoute;

