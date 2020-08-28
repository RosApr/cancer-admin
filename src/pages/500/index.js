import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from '@/utils/requestHook';
import './index.scss';

export default function ServerError() {
  const { history } = useNavigate();
  return (
    <Result
      className='error-page'
      status='500'
      title='服务器开小差啦~'
      extra={
        <Button type='primary' onClick={() => history.replace('/login')}>
          返回
        </Button>
      }
    />
  );
}
