import React, { useCallback, useState, useEffect } from 'react';
import { Button, Input, Form, Space, message as Message } from 'antd';
import {
  addCancerApi,
  updateCancerApi,
  fetchCancerDetailApi,
} from '@/api/cancer';
import {
  useNavigate,
  useFetchDataOnMount,
  useRequest,
} from '@/utils/requestHook';
import { FORM_ITEM_LAYOUT } from '@/utils/consts';
import { useReturnCurrentFormStatus } from '@/utils/requestHook';
import './index.scss';

const { TextArea } = Input;
const textareaConfig = { minRows: 4 };
const { Item } = Form;

const initialFormData = {
  name: '',
  cancer_template: '{}',
};

export default function CancerForm() {
  const { params, history } = useNavigate();

  const isUpdate = useReturnCurrentFormStatus(params.operationType);

  const [form] = Form.useForm();

  const [formInitialData, setFormInitialData] = useState(null);

  const fetchDataWhenIsUpdateCallback = useCallback(() => {
    if (isUpdate === null) return;
    if (isUpdate) {
      return fetchCancerDetailApi(params.cancer_id);
    }
    return null;
  }, [params, isUpdate]);

  const {
    response: fetchDataWhenIsUpdateResponse,
    error: fetchDataWhenIsUpdateError,
  } = useFetchDataOnMount(fetchDataWhenIsUpdateCallback);

  useEffect(() => {
    if (isUpdate !== null) {
      if (
        isUpdate &&
        fetchDataWhenIsUpdateError.status === 0 &&
        fetchDataWhenIsUpdateResponse
      ) {
        setFormInitialData({
          ...initialFormData,
          ...fetchDataWhenIsUpdateResponse,
          cancer_template: JSON.stringify(
            fetchDataWhenIsUpdateResponse.cancer_template,
            null,
            2
          ),
        });
      } else if (!isUpdate) {
        setFormInitialData(initialFormData);
      }
    }
  }, [isUpdate, fetchDataWhenIsUpdateResponse, fetchDataWhenIsUpdateError]);

  const goCancerList = useCallback(() => history.push('/app/cancer/index'), [
    history,
  ]);

  // submit form function callback version
  const submitCb = useCallback(
    (cancer_id, data) => {
      if (isUpdate) {
        return updateCancerApi(cancer_id, data);
      } else {
        return addCancerApi(data);
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
        goCancerList();
      });
    }
  }, [submitError, goCancerList, isUpdate]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        // name field is untouched and not empty or in edit
        // and name equal edit init name
        const { cancer_template, ...config } = values;
        try {
          const checkData = { cancer_template: JSON.parse(cancer_template) };
          return submit(params.cancer_id, {
            ...config,
            ...checkData,
          });
        } catch (e) {
          Message.error('配置解析失败，请检查！');
        }
      })
      .catch(error => {});
  };

  return (
    <div className='cancer-form-layer'>
      {formInitialData && (
        <Form
          form={form}
          name='Form'
          labelAlign='right'
          {...FORM_ITEM_LAYOUT}
          initialValues={formInitialData}
        >
          <Item
            label='名称'
            name='name'
            rules={[{ required: true, message: '请填写名称' }]}
          >
            <Input />
          </Item>
          <Item label='配置' name='cancer_template'>
            <TextArea autoSize={textareaConfig} />
          </Item>
          <Item wrapperCol={{ span: 24 }} className='center'>
            <Space size='middle'>
              <Button type='primary' onClick={handleSubmit}>
                保存
              </Button>
              <Button onClick={goCancerList}>取消</Button>
            </Space>
          </Item>
        </Form>
      )}
    </div>
  );
}
