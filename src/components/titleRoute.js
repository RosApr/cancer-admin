import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';

export default function TitleRoute({ component: Component, state, ...rest }) {
  useEffect(() => {
    document.title = state.meta;
  }, [state.meta]);
  return (
    <Route {...rest} render={routerProps => <Component {...routerProps} />} />
  );
}
