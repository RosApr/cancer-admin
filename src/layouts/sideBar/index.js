import React from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import './index.scss';

export default function SideBar(sideBarMap = [], location) {
  return sideBarMap.length > 0 ? (
    <Menu theme='dark' mode='inline' selectedKeys={[location.pathname]}>
      {sideBarMap.map(({ state: { meta }, path, menuIcon: MenuIcon }) => (
        <Menu.Item key={path}>
          <NavLink to={path} activeClassName='active'>
            <MenuIcon />
            <span>{meta}</span>
          </NavLink>
        </Menu.Item>
      ))}
    </Menu>
  ) : null;
}
