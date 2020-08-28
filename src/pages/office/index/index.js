import React, { useCallback, useEffect } from 'react';
import { Button, Table, Row, Col } from 'antd';
import { createSelector } from 'reselect';
import { useDispatch } from 'react-redux';
import { useShallowEqualSelector } from '@/utils/common';
import { fetchOfficeList } from '@/redux/actions/office';
import { sync, useNavigate } from '@/utils/requestHook';
import { sync as officeSync } from '@/api/office';
import './index.scss';

const makeTableColumn = ({ handleEditBtnClick }) => [
  {
    title: '门店缩略图',
    dataIndex: 'image',
    key: 'image',
    render: (imgUrl, record) => {
      return <img className='img-thumb' src={imgUrl} alt={record['name']} />;
    },
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '客服电话',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '操作',
    dataIndex: 'manual',
    key: 'manual',
    render: (_, record) => (
      <Button type='' onClick={() => handleEditBtnClick(record.id)}>
        编辑
      </Button>
    ),
  },
];

const officeListSelector = createSelector(
  state => state.office.list,
  state => state.office.isFetching,
  (list, isFetching) => ({
    list,
    isFetching,
  }),
);

export default function OfficeIndex() {
  const { history } = useNavigate();

  const dispatch = useDispatch();
  const { list, isFetching } = useShallowEqualSelector(officeListSelector);

  useEffect(() => {
    dispatch(fetchOfficeList());
  }, [dispatch]);

  const handleEditBtnClick = id => {
    history.push(`/app/offices/edit/${id}`);
  };

  const tableColumn = makeTableColumn({ handleEditBtnClick });
  return (
    <div className='office-index-layer'>
      <Row align='middle' justify='end' gutter={24}>
        <Col flex='0 0 auto'>
          <h3>同步更新诊所列表:</h3>
        </Col>
        <Col flex='0 0 auto'>
          <Button type='primary' onClick={() => sync(officeSync)}>
            同步更新
          </Button>
        </Col>
      </Row>

      <Table
        className='list-table'
        rowKey={'id'}
        columns={tableColumn}
        dataSource={list}
        pagination={false}
        loading={{
          delay: 500,
          spinning: isFetching,
        }}
        bordered
      ></Table>
    </div>
  );
}
