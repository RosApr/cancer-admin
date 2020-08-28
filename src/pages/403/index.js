import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from '@/utils/requestHook';
import './index.scss';

export default function NoAuth() {
  const { history } = useNavigate();
  return (
    <Result
      className='error-page'
      status='403'
      title='权限不足'
      extra={
        <Button type='primary' onClick={() => history.replace('/login')}>
          返回
        </Button>
      }
    />
  );
}
