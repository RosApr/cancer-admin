import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Input, InputNumber, Switch, Space, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { getDoctor, saveDoctor as saveDoctorApi } from '@/api/doctor';
import {
  useRequest,
  useFetchDataOnMount,
  useNavigate,
  useRequestResult,
} from '@/utils/requestHook';
import { UPDATE_DOCTOR } from '@/redux/actionTypes/doctor';
import { getOffices } from '@/api/office';
import Step from '@/components/step';
import Upload from '@/components/upload';
import './index.scss';
const currentStep = 0;

const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
export default function DoctorEditBasic() {
  const dispatch = useDispatch();
  const {
    params: { id: doctorId },
    history,
  } = useNavigate();
  // get office list
  const fetchOfficeApiCallback = useCallback(
    async () => await getOffices(),
    [],
  );
  const { response: officeList } = useFetchDataOnMount(
    fetchOfficeApiCallback,
    [],
  );

  // get doctor detail
  const fetchDoctorBasicApiCallback = useCallback(
    async () => await getDoctor(doctorId),
    [doctorId],
  );
  const { response: doctorBasic } = useFetchDataOnMount(
    fetchDoctorBasicApiCallback,
    null,
  );
  // Upload component data init
  const [imgList, setImgList] = useState([]);
  const [isUpLoadingImg, setIsUpLoadingImg] = useState(false);
  const handleUploadImgChange = imgFile => {
    if (imgFile.status === 'uploading') {
      setIsUpLoadingImg(true);
    } else if (imgFile.status === 'done') {
      setIsUpLoadingImg(false);
      setImgList([imgFile]);
    }
    // else if(imgFile.status === 'remove') {

    // } else if(imgFile.status === 'error') {

    // }
  };

  useEffect(() => {
    if (doctorBasic) {
      setImgList([
        {
          uid: '-1',
          name: doctorBasic.avatar,
          url: doctorBasic.avatar,
          status: 'done',
        },
      ]);
    }
  }, [doctorBasic]);
  const [{ response, requestData, error }, saveDoctor] = useRequest(
    saveDoctorApi,
  );
  const saveCallback = useCallback(
    requestData => {
      dispatch({
        type: UPDATE_DOCTOR,
        payload: requestData,
      });
    },
    [dispatch],
  );
  useRequestResult({ response, error, requestData, cb: saveCallback });
  const handleFormSubmit = values => {
    const formData = { ...doctorBasic, ...values };
    saveDoctor(formData);
  };
  const goNext = () => history.push(`/app/doctor/resume/${doctorId}`);
  const goDoctorList = () => history.push('/app/doctor/index');
  return (
    <div className='doctor-edit-basic-layer'>
      <Step defaultCurrent={currentStep} />
      {doctorBasic && officeList.length > 0 && (
        <Form
          name='doctorBasicForm'
          labelAlign='right'
          {...formItemLayout}
          onFinish={handleFormSubmit}
          initialValues={{
            ...doctorBasic,
            officeId: doctorBasic.office.id,
          }}
        >
          <Form.Item
            name='name'
            label='姓名'
            rules={[{ required: true, message: '请填写医生姓名' }]}
          >
            <Input disabled />
          </Form.Item>
          {imgList.length > 0 && (
            <Form.Item
              name='avatar'
              label='医生头像'
              extra='最多上传一张照片'
              rules={[{ required: true, message: '请上传一张图片' }]}
              normalize={value => {
                const isNotChange = typeof value === 'string';
                if (isNotChange) {
                  return value;
                }
                if (value['status'] === 'done') {
                  return value.response.data.url;
                }
                return '';
              }}
            >
              <Upload imgList={imgList} onChange={handleUploadImgChange} />
            </Form.Item>
          )}
          <Form.Item
            label='所属诊所'
            name='officeId'
            rules={[{ required: true }]}
          >
            <Select>
              {officeList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='departmentName' label='所属科室'>
            <Input />
          </Form.Item>
          <Form.Item
            name='title'
            label='职称'
            rules={[{ required: true, message: '必填' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='expertIn'
            label='擅长方向'
            rules={[{ required: true, message: '必填' }]}
          >
            <TextArea rows={4} allowClear />
          </Form.Item>
          <Form.Item
            name='privateSupport'
            label='擅支持私人医生长方向'
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
          <Form.Item label='图文问诊' className='no-margin-bottom'>
            <Form.Item
              className='default-input-container'
              name='imageConsult'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.imageConsult !== currentValues.imageConsult
              }
            >
              {({ getFieldValue }) => {
                return getFieldValue('imageConsult') ? (
                  <>
                    <Form.Item
                      className='extra-input-container'
                      name='imageConsultPrice'
                      rules={[
                        { required: true, message: '请填写图文问诊单价' },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <span className='extra-input-label'>元/每次</span>
                  </>
                ) : null;
              }}
            </Form.Item>
          </Form.Item>
          <Form.Item label='电话问诊' className='no-margin-bottom'>
            <Form.Item
              className='default-input-container'
              name='phoneConsult'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.phoneConsult !== currentValues.phoneConsult
              }
            >
              {({ getFieldValue }) => {
                return getFieldValue('phoneConsult') ? (
                  <>
                    <Form.Item
                      className='extra-input-container'
                      name='phoneConsultPrice'
                      rules={[
                        { required: true, message: '请填写电话问诊单价' },
                      ]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <span className='extra-input-label'>元/每次</span>
                  </>
                ) : null;
              }}
            </Form.Item>
          </Form.Item>
          <Form.Item className='center' wrapperCol={{ span: 24 }}>
            <Space size='large'>
              <Button
                type='primary'
                htmlType='submit'
                disabled={isUpLoadingImg}
              >
                保存
              </Button>
              <Button type='primary' onClick={goNext}>
                下一步
              </Button>
              <Button onClick={goDoctorList}>返回</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
