import React, { useCallback, useEffect } from 'react';
import { Button, Table, Space } from 'antd';
import { createSelector } from 'reselect';
import { useDispatch } from 'react-redux';
import { useShallowEqualSelector } from '@/utils/common';
import { useNavigate } from '@/utils/requestHook';
import { fetchServiceList } from '@/redux/actions/service';
import './index.scss';

const serviceListSelector = createSelector(
  state => state.service.list,
  state => state.service.isFetching,
  (list, isFetching) => ({
    list,
    isFetching,
  }),
);
const makeTableColumn = ({ handleEditBtnClick, handleDelBtnClick }) => [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '操作',
    width: 400,
    dataIndex: 'manual',
    key: 'manual',
    render: (_, record) => (
      <Space size='middle'>
        <Button type='' onClick={() => handleEditBtnClick(record.id)}>
          编辑
        </Button>
        <Button
          danger
          className='hide'
          onClick={() => handleDelBtnClick(record.id)}
        >
          删除
        </Button>
      </Space>
    ),
  },
];
export default function ServiceIndex() {
  const { history } = useNavigate();
  const dispatch = useDispatch();
  const { list, isFetching } = useShallowEqualSelector(serviceListSelector);

  useEffect(() => {
    dispatch(fetchServiceList());
  }, [dispatch]);

  const handleEditBtnClick = id => {
    history.push(`/app/services/edit/${id}`);
  };
  const handleDelBtnClick = id => {
    console.log(id);
  };
  const tableColumn = makeTableColumn({
    handleEditBtnClick,
    handleDelBtnClick,
  });
  return (
    <div className='service-index-layer'>
      <Table
        className='list-table'
        rowKey='id'
        pagination={false}
        bordered
        dataSource={list}
        columns={tableColumn}
        loading={{
          delay: 500,
          spinning: isFetching,
        }}
      />
    </div>
  );
}
