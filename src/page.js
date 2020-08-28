import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { routeMap } from '@/router/config';
import { ROLE_ANONYMOUS } from '@/utils/consts';
import app from '@/layouts/authLayout';
import TitleRouter from '@/components/titleRoute';

const noAuthRoutes = routeMap.filter(({ role }) =>
  role.includes(ROLE_ANONYMOUS),
);
export default function Page() {
  return (
    <Switch>
      <Route
        exact
        path='/'
        render={() => (
          <Redirect
            to={{
              pathname: '/app',
            }}
          />
        )}
      />
      <Route path='/app' component={app} />
      {noAuthRoutes.map(({ main, ...rest }, index) => (
        <Route key={index} {...rest}>
          <TitleRouter {...rest} component={main} />
        </Route>
      ))}
      <Route>
        <Redirect to='/404' />
      </Route>
    </Switch>
  );
}
