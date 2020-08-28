import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from '@/utils/requestHook';
import './index.scss';

export default function NotFound() {
  const { history } = useNavigate();
  return (
    <Result
      className='error-page'
      status='404'
      title='访问内容不存在'
      extra={
        <Button type='primary' onClick={() => history.replace('/')}>
          返回
        </Button>
      }
    />
  );
}
