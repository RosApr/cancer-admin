import React, { useCallback, useState, useEffect } from 'react';
import { Button, Input, Form, Space, Select, Tag } from 'antd';
import {
  fetchProjectDetailApi,
  updateProjectCheckApi,
  updateProjectConfigApi,
} from '@/api/project';
import { getDoctorListApi } from '@/api/doctor';
import { fetchCancersApi } from '@/api/cancer';
import {
  useNavigate,
  useFetchDataOnMount,
  useRequest,
  useRequestResult,
} from '@/utils/requestHook';
import { FORM_ITEM_LAYOUT } from '@/utils/consts';
import { useReturnCurrentFormStatus } from '@/utils/requestHook';
import './index.scss';

const { TextArea } = Input;
const { Option } = Select;
const { Item } = Form;

const textareaConfig = { minRows: 4 };
const initialFormData = {
  acceptance: '',
  exclusion: '',
  description: '',
  check_criterion: '',
  person_in_charge: '',
};

export default function ProjectForm() {
  const { params, history } = useNavigate();

  const isUpdate = useReturnCurrentFormStatus(params.operationType);

  const [init, setInit] = useState(false);

  const [form] = Form.useForm();
  const [doctorList, setDoctorList] = useState([]);

  const fetchDoctorCallback = useCallback(() => {
    return getDoctorListApi();
  }, []);

  const {
    response: fetchDoctorResponse,
    error: fetchDoctorError,
  } = useFetchDataOnMount(fetchDoctorCallback);

  const [formInitialData, setFormInitialData] = useState(null);

  const fetchProjectCallback = useCallback(() => {
    return fetchProjectDetailApi(params);
  }, [params]);

  const [
    { response: fetchProjectResponse, error: fetchProjectError },
    fetchProject,
  ] = useRequest(fetchProjectCallback);

  const fetchCacnerCallback = useCallback(() => {
    return fetchCancersApi(params);
  }, [params]);

  const [
    { response: fetchCancerResponse, error: fetchCancerError },
    fetchCancer,
  ] = useRequest(fetchCacnerCallback);

  useEffect(() => {
    if (isUpdate !== null && isUpdate && !init) {
      setInit(true);
      fetchProject();
    } else if (isUpdate !== null && !isUpdate && !init) {
      setInit(true);
      fetchCancer();
    }
  }, [isUpdate, fetchProject, fetchCancer, init]);

  useEffect(() => {
    if (
      fetchProjectResponse &&
      fetchProjectError.status === 0 &&
      fetchDoctorResponse &&
      fetchDoctorError.status === 0
    ) {
      setDoctorList(fetchDoctorResponse);
      setFormInitialData({
        ...initialFormData,
        ...fetchProjectResponse,
        check_criterion: JSON.stringify(
          fetchProjectResponse.check_criterion,
          null,
          2
        ),
      });
    }
  }, [
    fetchProjectResponse,
    fetchProjectError,
    fetchDoctorResponse,
    fetchDoctorError,
  ]);

  const goProjectList = () => history.push('/app/project/index');

  // submit form function callback version
  const submitCb = useCallback((project_id, data) => {
    const { check_criterion, ...config } = data;
    const checkData = { check_criterion: JSON.parse(check_criterion) };
    return Promise.all([
      updateProjectCheckApi(project_id, checkData),
      updateProjectConfigApi(project_id, config),
    ]);
  }, []);

  const [{ error: submitError }, submit] = useRequest(submitCb);

  useRequestResult({
    error: submitError,
    cb: goProjectList,
    // messageTip: isEdit ? '修改成功！' : '添加成功！',
    messageTip: '修改成功！',
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        // name field is untouched and not empty or in edit
        // and name equal edit init name
        return submit(params.project_id, values);
      })
      .catch(error => {});
  };

  return (
    <div className='dashboard-layer'>
      {formInitialData && doctorList.length > 0 && (
        <Form
          form={form}
          name='Form'
          labelAlign='right'
          {...FORM_ITEM_LAYOUT}
          initialValues={formInitialData}
        >
          <Item name='person_in_charge' label='负责医生'>
            <Select>
              {doctorList.map(({ name, position, telphone, visit_time }) => (
                <Option value={name} key={name}>
                  {name} | <Tag color='blue'>{position}</Tag>
                  {telphone ? ` | ${telphone}` : ''}
                  {visit_time ? ` |  门诊时间：${visit_time}` : ''}
                </Option>
              ))}
            </Select>
          </Item>
          <Item
            label='入组标准'
            name='acceptance'
            rules={[{ required: true, message: '请填写入组标准' }]}
          >
            <TextArea autoSize={textareaConfig} />
          </Item>
          <Item
            label='项目描述'
            name='description'
            rules={[{ required: true, message: '请填写项目描述' }]}
          >
            <TextArea autoSize={textareaConfig} />
          </Item>
          <Item
            label='排除标准'
            name='exclusion'
            rules={[{ required: true, message: '请填写排除标准' }]}
          >
            <TextArea autoSize={textareaConfig} />
          </Item>
          <Item
            label='配置'
            name='check_criterion'
            rules={[{ required: true, message: '请填写配置' }]}
          >
            <TextArea autoSize={textareaConfig} />
          </Item>
          <Item wrapperCol={{ span: 24 }} className='center'>
            <Space size='middle'>
              <Button type='primary' onClick={handleSubmit}>
                保存
              </Button>
              <Button onClick={goProjectList}>取消</Button>
            </Space>
          </Item>
        </Form>
      )}
    </div>
  );
}
