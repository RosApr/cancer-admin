import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Table,
  Row,
  Col,
  Avatar,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { createSelector } from 'reselect';
import { useDispatch } from 'react-redux';
import { sync, useNavigate } from '@/utils/requestHook';
import { fetchDoctorList } from '@/redux/actions/doctor';
import { DEL_DOCTOR } from '@/redux/actionTypes/doctor';
import { useShallowEqualSelector } from '@/utils/common';
import { syncDoctor, deleteDoctor } from '@/api/doctor';
import './index.scss';

const doctorListSelector = createSelector(
  state => state.doctor.list,
  state => state.doctor.isFetching,
  state => state.doctor.isFetchError,
  (list, isFetching, isFetchError) => ({
    list,
    isFetching,
    isFetchError,
  }),
);

const makeTableColumns = ({ handleEditBtnClick, popConfirmConfig }) => [
  {
    title: '姓名',
    dataIndex: 'name',
    width: '8%',
    align: 'center',
  },
  {
    title: '照片',
    dataIndex: 'avatar',
    render: (avatar, record) => {
      const avatarProps = {
        ...(avatar
          ? { src: avatar, size: 160 }
          : { icon: record.name.slice(0, 1), size: 80 }),
      };
      return <Avatar {...avatarProps} />;
    },
    align: 'center',
  },
  {
    title: '职称',
    dataIndex: 'title',
    width: '8%',
    align: 'center',
  },
  {
    title: '所属诊所',
    dataIndex: 'office',
    render: ({ name }) => name,
    width: '12%',
    align: 'center',
  },
  {
    title: '所属科室',
    dataIndex: 'departmentName',
    width: '10%',
    align: 'center',
  },
  {
    title: '擅长方向',
    dataIndex: 'expertIn',
    align: 'center',
    render: expertIn => <span className='export-in'>{expertIn}</span>,
  },
  {
    title: '支持私人医生',
    dataIndex: 'privateSupport',
    render: privateSupport => (privateSupport ? '是' : '否'),
    width: '10%',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'manual',
    render: (_, record) => (
      <Space size='middle'>
        <Button type='' onClick={() => handleEditBtnClick(record.id)}>
          编辑
        </Button>
        <Popconfirm {...popConfirmConfig(record)}>
          <Button danger>删除</Button>
        </Popconfirm>
      </Space>
    ),
  },
];
export default function DoctorIndex() {
  const dispatch = useDispatch();
  const { list, isFetching, isFetchError } = useShallowEqualSelector(
    doctorListSelector,
  );

  useEffect(() => {
    dispatch(fetchDoctorList());
  }, [dispatch]);

  const { history } = useNavigate();

  const popConfirmConfig = ({ id, name }) => {
    return {
      onConfirm: async () => {
        try {
          await deleteDoctor(id);
          dispatch({
            type: DEL_DOCTOR,
            payload: {
              id,
            },
          });
        } catch (e) {
          message.error({
            content: e.message,
          });
        }
      },
      placement: 'bottomRight',
      cancelText: '取消',
      okText: '确认',
      title: `确认删除${name}医生吗`,
    };
  };

  const handleEditBtnClick = id => {
    history.push(`/app/doctor/basic/${id}`);
  };

  const tableColumn = makeTableColumns({
    popConfirmConfig,
    handleEditBtnClick,
  });
  return (
    <div className='doctor-index-layer'>
      <Row align='middle' justify='end' gutter={24}>
        <Col flex='0 0 auto'>
          <h3>同步更新医生列表:</h3>
        </Col>
        <Col flex='0 0 auto'>
          <Space size='middle'>
            <Button type='primary' onClick={() => sync(syncDoctor)}>
              同步更新
            </Button>
            {/* <Button
              type='primary'
              onClick={() => history.push('/app/doctor/basic')}
            >
              新增
            </Button> */}
          </Space>
        </Col>
      </Row>
      <Table
        loading={{
          delay: 500,
          spinning: isFetching,
        }}
        className='list-table'
        dataSource={list}
        rowKey='id'
        bordered
        pagination={false}
        columns={tableColumn}
      />
    </div>
  );
}
