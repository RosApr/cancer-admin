import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Input,
  Form,
  Space,
  // Select,
  Switch,
  message as Message,
} from 'antd';

import {
  addDoctorApi,
  updateDoctorApi,
  fetchDoctorDetailApi,
} from '@/api/doctor';
// import { fetchCancersApi } from '@/api/cancer';
import {
  useNavigate,
  useFetchDataOnMount,
  useRequest,
} from '@/utils/requestHook';
import { FORM_ITEM_LAYOUT } from '@/utils/consts';
import { useReturnCurrentFormStatus } from '@/utils/requestHook';
import './index.scss';

// const { Option } = Select;
const { Item } = Form;

const initialFormData = {
  name: '',
  position: '',
  telphone: '',
  visit_time: '',
  isRegister: false,
};

export default function ProjectForm() {
  const { params, history } = useNavigate();

  const isUpdate = useReturnCurrentFormStatus(params.operationType);

  const [form] = Form.useForm();

  const [formInitialData, setFormInitialData] = useState(null);

  const fetchDoctorCallback = useCallback(() => {
    if (isUpdate === null) return;
    if (isUpdate) {
      return fetchDoctorDetailApi(params.doctor_id);
    }
    return null;
  }, [isUpdate, params]);

  const {
    response: fetchDoctorResponse,
    error: fetchDoctorError,
  } = useFetchDataOnMount(fetchDoctorCallback);

  useEffect(() => {
    if (isUpdate !== null) {
      if (isUpdate && fetchDoctorError.status === 0 && fetchDoctorResponse) {
        setFormInitialData({
          ...initialFormData,
          ...fetchDoctorResponse,
        });
      } else if (!isUpdate) {
        setFormInitialData(initialFormData);
      }
    }
  }, [isUpdate, fetchDoctorError, fetchDoctorResponse]);

  const goDoctorList = useCallback(() => history.push('/app/doctor/index'), [
    history,
  ]);

  // submit form function callback version
  const submitCb = useCallback(
    (doctor_id, data) => {
      if (isUpdate) {
        return updateDoctorApi(doctor_id, data);
      } else {
        return addDoctorApi(data);
      }
    },
    [isUpdate]
  );

  const [{ error: submitError }, submit] = useRequest(submitCb);

  useEffect(() => {
    if (submitError.status === 1) {
      Message.success('操作异常！');
    } else if (submitError.status === 0) {
      Message.success(isUpdate ? '修改成功！' : '添加成功！').then(() => {
        goDoctorList();
      });
    }
  }, [submitError, goDoctorList, isUpdate]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        // name field is untouched and not empty or in edit
        // and name equal edit init name
        delete values.isRegister;
        return submit(params.doctor_id, values);
      })
      .catch(error => {});
  };

  return (
    <div className='dashboard-layer'>
      {formInitialData && (
        <Form
          form={form}
          name='Form'
          labelAlign='right'
          {...FORM_ITEM_LAYOUT}
          initialValues={formInitialData}
        >
          <Item
            label='姓名'
            name='name'
            rules={[{ required: true, message: '请填写姓名' }]}
          >
            <Input />
          </Item>
          <Item name='isRegister' label='微信绑定' valuePropName='checked'>
            <Switch
              disabled
              checkedChildren='已绑定'
              unCheckedChildren='未绑定'
            />
          </Item>
          <Item label='职称' name='position'>
            <Input />
          </Item>
          <Item label='联系电话' name='telphone'>
            <Input />
          </Item>
          <Item label='门诊时间' name='visit_time'>
            <Input />
          </Item>
          <Item wrapperCol={{ span: 24 }} className='center'>
            <Space size='middle'>
              <Button type='primary' onClick={handleSubmit}>
                保存
              </Button>
              <Button onClick={goDoctorList}>取消</Button>
            </Space>
          </Item>
        </Form>
      )}
    </div>
  );
}
