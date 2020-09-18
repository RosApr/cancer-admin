import React, { useCallback, useMemo, useState } from 'react';
import { Tag, Button, Table, Message } from 'antd';
import Clipboard from 'react-clipboard.js';
import { SyncOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { fetchDoctorDetailApi } from '@/api/doctor';
import { useFetchDataOnMount, useNavigate } from '@/utils/requestHook';
import DetailItem from '@/components/detailItem';
import './index.scss';

const tableColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: 50,
  },
  {
    title: '项目描述',
    dataIndex: 'description',
    align: 'center',
    width: 120,
    render: input => input || 0,
  },
  {
    title: '提交人数',
    dataIndex: 'submit_patients_num',
    align: 'center',
    width: 120,
    render: input => input || 0,
  },
  {
    title: '入组人数',
    dataIndex: 'accept_patients_num',
    align: 'center',
    width: 120,
    render: input => input || 0,
  },
  {
    title: '项目状态',
    dataIndex: 'progress',
    align: 'center',
    width: 120,
    render: input =>
      input === 0 ? (
        <Tag icon={<SyncOutlined spin />} color='processing'>
          正在进行
        </Tag>
      ) : (
        <Tag icon={<MinusCircleOutlined />} color='cyan'>
          已结束
        </Tag>
      ),
  },
];

export default function DoctorView() {
  const { params, history } = useNavigate();

  const fetchDoctorCallback = useCallback(() => {
    return fetchDoctorDetailApi(params.doctor_id);
  }, [params]);
  const {
    response: fetchDoctorResponse,
    error: fetchDoctorError,
  } = useFetchDataOnMount(fetchDoctorCallback);

  const responseMemo = useMemo(() => {
    if (fetchDoctorError.status === 0 && fetchDoctorResponse) {
      return fetchDoctorResponse;
    }
    return null;
  }, [fetchDoctorError, fetchDoctorResponse]);

  const goBack = () => {
    return history.push('/app/doctor/index');
  };
  const [current, setCurrent] = useState(1);
  const handlePageChange = e => {
    setCurrent(e);
  };
  const copySuccess = () => Message.success('复制成功');
  return (
    <div className='doctor-detail-page'>
      {responseMemo && (
        <div>
          <DetailItem itemWidth label='id'>
            {responseMemo.id}
          </DetailItem>
          <DetailItem itemWidth label='医生姓名'>
            {responseMemo.name}
          </DetailItem>
          <DetailItem itemWidth label='密码'>
            <Tag color='success'>{responseMemo.password}</Tag>
            <Clipboard
              title='复制密码至剪切板'
              component='span'
              onSuccess={copySuccess}
              data-clipboard-text={responseMemo.password}
            >
              <Button>复制密码至剪切板</Button>
            </Clipboard>
          </DetailItem>
          <DetailItem label='职称'>{responseMemo.position}</DetailItem>
          <DetailItem label='联系电话'>{responseMemo.telphone}</DetailItem>
          <DetailItem label='手机号'>{responseMemo.mobile_phone}</DetailItem>
          <DetailItem label='门诊时间'>{responseMemo.visit_time}</DetailItem>
          <DetailItem label='微信绑定'>
            {responseMemo.isRegister ? (
              <Tag color='success'>已绑定</Tag>
            ) : (
              <Tag color='error'>未绑定</Tag>
            )}
          </DetailItem>
          <DetailItem label='负责项目'>
            <Table
              rowKey='id'
              bordered
              columns={tableColumns}
              dataSource={responseMemo.projects || []}
              className='table'
              pagination={{
                current: current,
                pageSize: 10,
                total: responseMemo.projects.total || 0,
                showSizeChanger: false,
                hideOnSinglePage: true,
                onChange: handlePageChange,
              }}
            ></Table>
          </DetailItem>
          <DetailItem>
            <Button type='primary' onClick={goBack}>
              返回
            </Button>
          </DetailItem>
        </div>
      )}
    </div>
  );
}
