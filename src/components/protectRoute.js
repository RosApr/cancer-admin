import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getTokenFromCookie } from '@/utils/cookie';

export default function ProtectRoute({ children, ...rest }) {
  const hasToken = !!getTokenFromCookie();
  // There can do more Permission Validation with rest.role
  return (
    <Route
      {...rest}
      render={routerProps =>
        hasToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: routerProps.location },
            }}
          />
        )
      }
    />
  );
}
