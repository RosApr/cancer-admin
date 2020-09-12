import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  Tag,
  Button,
  Table,
  Space,
  Popconfirm,
  Modal,
  Form,
  Input,
} from 'antd';
import { SyncOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { fetchProjectDetailApi } from '@/api/project';
import {
  useFetchDataOnMount,
  useRequest,
  useNavigate,
  useRequestResult,
} from '@/utils/requestHook';
import DetailItem from '@/components/detailItem';
import {
  addPatientApi,
  updatePatientApi,
  deletePatientApi,
} from '@/api/patient';
import { FORM_ITEM_LAYOUT } from '@/utils/consts';
import './index.scss';

const { TextArea } = Input;
const textareaConfig = { minRows: 4 };
const { Item } = Form;
const initialFormData = {
  name: '',
  id_card: '',
  telphone: '',
  illness_description: '',
};
const objectToArray = (object = {}) => {
  const config = Object.entries(object);
  return config.map(([key, value]) => ({
    name: key,
    value,
    touched: false,
    validating: false,
  }));
};
const initialFormDataArray = objectToArray(initialFormData);
const makeTableColumns = (goPatientEdit = () => {}, delPatient = () => {}) => [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '联系电话',
    dataIndex: 'telphone',
    align: 'center',
  },
  {
    title: '身份证号',
    dataIndex: 'id_card',
    align: 'center',
  },
  {
    title: '入组时间',
    dataIndex: 'accept_time',
    align: 'center',
    render: input => (input ? new Date(input).toLocaleString() : ''),
  },
  {
    title: '病情描述',
    dataIndex: 'illness_description',
    align: 'center',
    width: 200,
  },
  {
    title: '入组情况',
    dataIndex: 'isAccepted',
    align: 'center',
    render: input =>
      input ? (
        <Tag color='success'>已入组</Tag>
      ) : (
        <Tag color='error'>未入组</Tag>
      ),
  },
  {
    title: '微信绑定',
    dataIndex: 'isRegisterWechat',
    align: 'center',
    render: input =>
      input ? (
        <Tag color='success'>已绑定</Tag>
      ) : (
        <Tag color='error'>未绑定</Tag>
      ),
  },
  {
    title: '操作',
    dataIndex: 'id',
    render: (id, { name }) => {
      return (
        <Space size='middle'>
          <Button type='primary' onClick={() => goPatientEdit(id)}>
            编辑
          </Button>
          <Popconfirm
            onConfirm={() => delPatient(id)}
            placement='bottomRight'
            cancelText='取消'
            okText='确认'
            title={`确认要删除${name}病人吗？`}
          >
            <Button type='danger'>删除</Button>
          </Popconfirm>
        </Space>
      );
    },
  },
];

export default function ProjectView() {
  const { params, history } = useNavigate();
  const fetchProjectCallback = useCallback(() => {
    return fetchProjectDetailApi(params);
  }, [params]);
  const {
    response: fetchProjectResponse,
    error: fetchProjectError,
  } = useFetchDataOnMount(fetchProjectCallback);

  const [projectDetail, setProjectDetail] = useState(null);
  const [patientList, setPatientList] = useState([]);
  useEffect(() => {
    if (fetchProjectError.status === 0 && fetchProjectResponse) {
      setProjectDetail(fetchProjectResponse);
      setPatientList(fetchProjectResponse.patients);
    }
  }, [fetchProjectError, fetchProjectResponse]);

  const goBack = () => {
    return history.push('/app/project/index');
  };

  const [current, setCurrent] = useState(1);

  const handlePageChange = currentPage => setCurrent(currentPage);

  const [form] = Form.useForm();

  const [showPatientForm, setShowPatientForm] = useState(false);

  const [formInitialData, setFormInitialData] = useState(null);

  const submitPatientCallback = useCallback(
    data => {
      if (!formInitialData) return;
      const formData = { ...data, project_id: +params.project_id };
      if (formInitialData.hasOwnProperty('id')) {
        return updatePatientApi(formInitialData.id, formData);
      } else {
        return addPatientApi(formData);
      }
    },
    [formInitialData, params]
  );
  const [
    {
      response: submitPatientResponse,
      error: submitPatientError,
      isLoading: submitPatientLoading,
    },
    submitPatient,
  ] = useRequest(submitPatientCallback);

  useRequestResult({
    response: submitPatientResponse,
    error: submitPatientError,
    cb: () => {
      const _patientList = [...patientList];
      if (formInitialData.hasOwnProperty('id')) {
        _patientList.splice(
          _patientList.findIndex(item => item.id === formInitialData.id),
          1,
          submitPatientResponse
        );
      } else {
        _patientList.push(submitPatientResponse);
      }
      setPatientList(_patientList);
      setShowPatientForm(false);
    },
  });

  const addPatient = () => {
    form.setFields(initialFormDataArray);
    setFormInitialData(initialFormData);
    setShowPatientForm(true);
  };

  const goPatientEdit = id => {
    const formData = {
      ...initialFormData,
      ...patientList.filter(item => item.id === id)[0],
    };
    setFormInitialData(formData);
    form.setFields(objectToArray(formData));
    setShowPatientForm(true);
  };

  const delPatientCallback = useCallback(id => {
    return deletePatientApi(id);
  }, []);
  const [
    {
      response: delPatientResponse,
      error: delPatientError,
      requestData: delPatientRequestData,
    },
    delPatient,
  ] = useRequest(delPatientCallback);

  useRequestResult({
    response: delPatientResponse,
    error: delPatientError,
    requestData: delPatientRequestData,
    cb: requestData => {
      const _patientList = [...patientList];
      _patientList.splice(
        _patientList.findIndex(item => item.id === requestData),
        1
      );
      setPatientList(_patientList);
    },
  });

  const handleDelPatient = id => {
    delPatient(id);
  };

  const tableColumns = makeTableColumns(goPatientEdit, handleDelPatient);

  const handlePatientModalConfirm = () => {
    form
      .validateFields()
      .then(async values => {
        // name field is untouched and not empty or in edit
        // and name equal edit init name
        return submitPatient(values);
      })
      .catch(error => {});
  };

  const resetPatientModal = () => {
    setShowPatientForm(false);
  };

  return (
    <div className='project-detail-page'>
      {projectDetail && (
        <div>
          <DetailItem itemWidth label='负责医生'>
            {projectDetail.person_in_charge}
            <Tag color='blue'>{projectDetail.doctor_position}</Tag>
            {projectDetail.doctor_telphone
              ? ` | ${projectDetail.doctor_telphone}`
              : ''}
            {projectDetail.doctor_visit_time &&
              ` |  门诊时间：${projectDetail.doctor_visit_time}`}
          </DetailItem>
          <DetailItem label='入组标准'>
            <div
              dangerouslySetInnerHTML={{ __html: projectDetail.acceptance }}
            />
          </DetailItem>
          <DetailItem label='项目描述'>{projectDetail.description}</DetailItem>
          <DetailItem label='排除标准'>
            <div
              dangerouslySetInnerHTML={{ __html: projectDetail.exclusion }}
            />
          </DetailItem>
          <DetailItem label='入组人数'>
            {projectDetail.accept_patients_num}人
          </DetailItem>
          <DetailItem label='申请人数'>
            {projectDetail.submit_patients_num}人
          </DetailItem>
          <DetailItem label='项目进度'>
            {projectDetail.progress === 0 ? (
              <Tag icon={<SyncOutlined spin />} color='processing'>
                正在进行
              </Tag>
            ) : (
              <Tag icon={<MinusCircleOutlined />} color='cyan'>
                已结束
              </Tag>
            )}
          </DetailItem>
          <DetailItem itemWidth label='项目进度'>
            <Button type='primary' onClick={addPatient}>
              新增病人
            </Button>
            <Table
              rowKey='id'
              bordered
              columns={tableColumns}
              dataSource={patientList || []}
              className='table'
              pagination={{
                current: current,
                pageSize: 10,
                showSizeChanger: false,
                hideOnSinglePage: true,
                onChange: handlePageChange,
              }}
            ></Table>
          </DetailItem>
          <DetailItem label='配置'>
            <TextArea
              disabled
              autoSize={textareaConfig}
              bordered
              value={JSON.stringify(projectDetail.check_criterion, null, 2)}
            />
          </DetailItem>
          <DetailItem>
            <Button type='primary' onClick={goBack}>
              返回
            </Button>
          </DetailItem>
        </div>
      )}
      <Modal
        forceRender
        getContainer={false}
        visible={showPatientForm}
        closable={false}
        mask
        title='病人管理'
        maskClosable={false}
        onOk={handlePatientModalConfirm}
        confirmLoading={submitPatientLoading}
        onCancel={resetPatientModal}
      >
        <Form form={form} name='Form' labelAlign='right' {...FORM_ITEM_LAYOUT}>
          <Item
            label='姓名'
            name='name'
            rules={[{ required: true, message: '请填写姓名' }]}
          >
            <Input />
          </Item>
          <Item label='身份证号' name='id_card'>
            <Input />
          </Item>
          <Item label='联系电话' name='telphone'>
            <Input />
          </Item>
          <Item label='病情描述' name='illness_description'>
            <TextArea autoSize={textareaConfig} bordered />
          </Item>
        </Form>
      </Modal>
    </div>
  );
}
