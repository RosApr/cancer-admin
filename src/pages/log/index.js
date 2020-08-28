import React, { useCallback } from 'react';
import { Table } from 'antd';
import { useFetchDataOnMount } from '@/utils/requestHook';
import { getLogs } from '@/api/log';
import './index.scss';

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '接口地址',
    dataIndex: 'request',
    render: text => (text ? text : ''),
  },
  {
    title: '内容',
    dataIndex: 'content',
    render: content => (
      <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
        {content}
      </div>
    ),
  },
  {
    title: '错误原因',
    dataIndex: 'message',
  },
  {
    title: '时间',
    dataIndex: 'created',
    width: 220,
    render: date => new Date(date).toLocaleString(),
  },
];
export default function Execption() {
  const fetchApiCallback = useCallback(async () => await getLogs(), []);
  const { response: list, isLoading } = useFetchDataOnMount(
    fetchApiCallback,
    [],
  );
  return (
    <div className='log-layer'>
      <Table
        pagination={{
          pageSize: 8,
          total: list.length,
          position: ['bottomRight'],
        }}
        bordered
        dataSource={list}
        columns={columns}
        loading={{
          delay: 500,
          spinning: isLoading,
        }}
        rowKey='id'
      />
    </div>
  );
}
