import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import classNames from 'classnames';
import { Switch, Redirect, Route, useLocation } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import createSideBar from '@/layouts/sideBar';
import Footer from '@/layouts/footer';
import logo from '@/assets/imgs/logo.png';
import Logout from '@/components/logout/index.js';
import { routeMap } from '@/router/config';
import { getUserRoleFromCookie } from '@/utils/cookie';
import ProtectRoute from '@/components/protectRoute';
import TitleRouter from '@/components/titleRoute';
import './index.scss';

const { Header, Content, Sider } = Layout;

export default function LayoutComponent() {
  const location = useLocation();
  const userRole = getUserRoleFromCookie();
  // routes map
  const requireAuthRoutes = routeMap.filter(({ role }) =>
    role.includes(userRole),
  );
  const defaultRoute = requireAuthRoutes[0];
  // side bar map
  const sideBarList = routeMap
    .filter(({ isInMenu }) => isInMenu)
    .filter(({ role }) => role.includes(userRole));
  const SideBar = createSideBar(sideBarList, location);

  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(prevCollapsed => !prevCollapsed);
  };
  const layoutClass = classNames('site-layout', {
    'collapsed-content': collapsed,
  });
  return (
    <Layout className='site-layout-container'>
      <Sider
        className='site-layout-side-bar'
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className='logo'>
          <img src={logo} alt='' />
        </div>
        {SideBar}
      </Sider>
      <Layout className={layoutClass}>
        <Header className='site-layout-header'>
          <Row justify='start' align='middle'>
            <Col flex='1 0 auto'>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: 'trigger',
                  onClick: toggle,
                },
              )}
            </Col>
            <Col flex='120px' className='logout-btn-container'>
              <Logout />
            </Col>
          </Row>
        </Header>
        <Content className='site-layout-content'>
          <Switch>
            {/* if routes length === 0 go login */}
            {requireAuthRoutes.length > 0 ? (
              requireAuthRoutes.map(({ main, ...rest }, index) => (
                <ProtectRoute key={index} {...rest}>
                  <TitleRouter component={main} {...rest}></TitleRouter>
                </ProtectRoute>
              ))
            ) : (
              <Route
                render={() => (
                  <Redirect
                    to={{
                      pathname: '/login',
                      state: { from: location },
                    }}
                  />
                )}
              ></Route>
            )}
            {/* if path is /app then redirect to first route in requireAuthRoutes */}
            {defaultRoute ? (
              <Route path='/app' exact>
                <Redirect to={defaultRoute.path} />
              </Route>
            ) : null}
            {/* no match go 404 */}
            <Route>
              <Redirect to='/404' />
            </Route>
          </Switch>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
// {
//   /* <ProtectRoute path={defaultRoute.path}>
//                   <TitleRouter
//                     component={defaultRoute.main}
//                     state={defaultRoute.state}
//                   ></TitleRouter>
//                 </ProtectRoute> */
// }
