import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Space, Input, Table } from 'antd';
import { createSelector } from 'reselect';
import { useDispatch } from 'react-redux';
import { fetchDoctorList } from '@/redux/actions/doctor';
import { getService, save as saveApi } from '@/api/service';
import { useShallowEqualSelector } from '@/utils/common';
import { UPDATE_SERVICE } from '@/redux/actionTypes/service';
import {
  useRequest,
  useFetchDataOnMount,
  useNavigate,
  useRequestResult,
} from '@/utils/requestHook';
import './index.scss';

const doctorListSelector = createSelector(
  state => state.doctor.list,
  doctorList => doctorList,
);

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const tableColumns = [
  {
    dataIndex: 'name',
    title: '名称',
  },
  {
    dataIndex: 'title',
    title: '职称',
  },
  {
    dataIndex: 'department',
    title: '科室',
  },
];
export default function ServiceEdit() {
  // fetchDoctorList
  const dispatch = useDispatch();
  const doctorList = useShallowEqualSelector(doctorListSelector);

  const fetchDoctorListCallback = useCallback(() => {
    dispatch(fetchDoctorList());
  }, [dispatch]);

  useEffect(() => {
    fetchDoctorListCallback();
  }, [fetchDoctorListCallback]);

  const {
    params: { id: serviceId },
    history,
  } = useNavigate();
  // save data
  const [{ response, error, requestData }, save] = useRequest(saveApi);
  const goServicesIndex = useCallback(
    requestData => {
      dispatch({
        type: UPDATE_SERVICE,
        payload: requestData,
      });
      history.push('/app/services/index');
    },
    [history, dispatch],
  );
  // submit
  useRequestResult({ response, requestData, error, cb: goServicesIndex });

  const fetchServiceApiCallback = useCallback(
    async () => await getService(serviceId),
    [serviceId],
  );
  const { response: serviceForm } = useFetchDataOnMount(
    fetchServiceApiCallback,
    null,
  );

  // doctor list table
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  useEffect(() => {
    if (serviceForm && doctorList.length > 0) {
      setSelectedDoctors(serviceForm['doctors']);
    }
  }, [serviceForm, doctorList]);

  const handleFormSubmit = values => {
    save({
      ...serviceForm,
      ...values,
      doctors: selectedDoctors,
    });
  };

  const handleSelectDoctorChange = selected => {
    setSelectedDoctors(selected);
  };
  return (
    <div className='service-edit-layer'>
      {serviceForm && doctorList.length > 0 && (
        <Form
          {...formItemLayout}
          name='serviceForm'
          labelAlign='right'
          onFinish={handleFormSubmit}
          initialValues={serviceForm}
        >
          <Form.Item
            name='name'
            label='名称'
            rules={[{ required: true, message: '请填写服务名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='选择名称' required={true}>
            <Table
              rowSelection={{
                type: 'checkout',
                selectedRowKeys: selectedDoctors,
                onChange: handleSelectDoctorChange,
              }}
              dataSource={doctorList}
              columns={tableColumns}
              className='doctor-list-table'
              rowKey='id'
              pagination={false}
              bordered
            ></Table>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
            <Space size='large'>
              <Button type='primary' htmlType='submit'>
                提交
              </Button>
              <Button onClick={() => history.goBack()}>返回</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
