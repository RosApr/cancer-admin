import React from 'react';
import { Button, Row, Col } from 'antd';
import { fetchArticles, syncDoctorSchedules } from '@/api/dashboard';
import { sync } from '@/utils/requestHook';
import './index.scss';

export default function Dashboard() {
  return (
    <div className='dashboard-layer'>
      <Row justify='start' align='middle' gutter={24} className='row'>
        <Col flex='0 0 auto'>
          <h3>同步更新微信公众号文章列表:</h3>
        </Col>
        <Col span={3}>
          <Button type='primary' onClick={() => sync(fetchArticles)}>
            同步更新
          </Button>
        </Col>
      </Row>
      <Row justify='start' align='middle' gutter={24} className='row'>
        <Col flex='0 0 auto'>
          <h3>同步更新医生信息:</h3>
        </Col>
        <Col span={3}>
          <Button type='primary' onClick={() => sync(syncDoctorSchedules)}>
            同步更新
          </Button>
        </Col>
      </Row>
    </div>
  );
}
