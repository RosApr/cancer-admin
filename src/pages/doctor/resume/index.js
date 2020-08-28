import React, { useCallback } from 'react';
import { Button, Form, Input, Space } from 'antd';
import { useDispatch } from 'react-redux';
import {
  getDoctorResume,
  saveDoctorResume as saveDoctorResumeApi,
} from '@/api/doctor';
import { UPDATE_DOCTOR } from '@/redux/actionTypes/doctor';
import {
  useRequest,
  useFetchDataOnMount,
  useNavigate,
  useRequestResult,
} from '@/utils/requestHook';
import Step from '@/components/step';
import './index.scss';

const currentStep = 1;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const { TextArea } = Input;
export default function DoctorEditResume() {
  const dispatch = useDispatch();
  const {
    params: { id: doctorId },
    history,
  } = useNavigate();
  // get doctor resume
  const fetchDoctorResumeApiCallback = useCallback(
    async () => await getDoctorResume(doctorId),
    [doctorId],
  );
  const { response: doctorResume } = useFetchDataOnMount(
    fetchDoctorResumeApiCallback,
    null,
  );

  const [{ response, requestData, error }, saveDoctorResume] = useRequest(
    saveDoctorResumeApi,
  );

  const goPrev = () => history.goBack();
  const goDoctorIndex = useCallback(
    requestData => {
      dispatch({
        type: UPDATE_DOCTOR,
        payload: requestData,
      });
      history.push('/app/doctor/index');
    },
    [history, dispatch],
  );

  useRequestResult({
    response,
    error,
    requestData,
    cb: goDoctorIndex,
  });
  const handleFormSubmit = values => {
    const formData = { ...doctorResume, ...values };
    saveDoctorResume(formData);
  };

  return (
    <div className='doctor-edit-resume-layer'>
      <Step defaultCurrent={currentStep} />
      {doctorResume && (
        <Form
          labelAlign='right'
          {...formItemLayout}
          onFinish={handleFormSubmit}
          initialValues={doctorResume}
        >
          <Form.Item label='等级' name='grade'>
            <Input />
          </Form.Item>
          <Form.Item label='个人简介' name='profile'>
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item label='执业经历' name='practiceExperience'>
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item label='学术经历' name='academicExperience'>
            <TextArea rows={5} />
          </Form.Item>
          <Form.Item className='center' wrapperCol={{ span: 24 }}>
            <Space size='large'>
              <Button type='primary' onClick={goPrev}>
                上一步
              </Button>
              <Button type='primary' htmlType='submit'>
                保存并返回
              </Button>
              <Button onClick={goDoctorIndex}>返回</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
