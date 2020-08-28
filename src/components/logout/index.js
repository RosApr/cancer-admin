import React from 'react';
import { Button } from 'antd';
import { removeTokenFromCookie } from '@/utils/cookie';
import { useNavigate } from '@/utils/requestHook';
export default function Logout() {
  const { history } = useNavigate();
  const handleLogoutBtnClick = () => {
    removeTokenFromCookie();
    history.push('/login');
  };
  return <Button onClick={handleLogoutBtnClick}>退出登录</Button>;
}
