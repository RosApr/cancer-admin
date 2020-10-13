import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  SyncOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Clipboard from 'react-clipboard.js';
import {
  Button,
  Input,
  Form,
  // Select,
  Switch,
  message as Message,
  Modal,
  Tag,
  Table,
  Space,
} from 'antd';
import { fetchProjectListApi } from '@/api/project';
import {
  addDoctorApi,
  updateDoctorApi,
  fetchDoctorDetailApi,
} from '@/api/doctor';
import { fetchCancersApi } from '@/api/cancer';
import {
  useNavigate,
  useFetchDataOnMount,
  useRequest,
} from '@/utils/requestHook';
import { FORM_ITEM_LAYOUT, fetchProjectDefaultParams } from '@/utils/consts';
import { useReturnCurrentFormStatus } from '@/utils/requestHook';
import './index.scss';

// const { Option } = Select;
const { Item } = Form;

const initialFormData = {
  name: '',
  position: '',
  telphone: '',
  mobile_phone: '',
  visit_time: '',
  isAdmin: false,
  isRegister: false,
  projects: [],
};
// const tableColumns = [
//   {
//     title: 'id',
//     dataIndex: 'id',
//     align: 'center',
//     width: 50,
//   },
//   {
//     title: '项目描述',
//     dataIndex: 'description',
//     align: 'center',
//     width: 240,
//     render: input => input || 0,
//   },
//   {
//     title: '所属病症',
//     dataIndex: 'cancer',
//     align: 'center',
//     width: 120,
//     render: input => input.name || 0,
//   },
//   {
//     title: '提交人数',
//     dataIndex: 'submit_patients_num',
//     align: 'center',
//     render: input => input || 0,
//   },
//   {
//     title: '入组人数',
//     dataIndex: 'accept_patients_num',
//     align: 'center',
//     render: input => input || 0,
//   },
//   {
//     title: '项目状态',
//     dataIndex: 'progress',
//     align: 'center',
//     width: 120,
//     render: input =>
//       input === 0 ? (
//         <Tag icon={<SyncOutlined spin />} color='processing'>
//           正在进行
//         </Tag>
//       ) : (
//         <Tag icon={<MinusCircleOutlined />} color='cyan'>
//           已结束
//         </Tag>
//       ),
//   },
// ];

export default function ProjectForm() {
  const { params, history } = useNavigate();

  const isUpdate = useReturnCurrentFormStatus(params.operationType);

  const [form] = Form.useForm();

  const [formInitialData, setFormInitialData] = useState(null);

  const [projectList, setProjectList] = useState([]);

  const [cancerList, setCancerList] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const fetchDataWhenIsUpdateCallback = useCallback(() => {
    if (isUpdate === null) return;
    if (isUpdate) {
      return Promise.all([
        fetchDoctorDetailApi(params.doctor_id),
        fetchProjectListApi(fetchProjectDefaultParams),
        fetchCancersApi(),
      ]);
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
          ...fetchDataWhenIsUpdateResponse[0],
        });
        setSelectedRowKeys(
          fetchDataWhenIsUpdateResponse[0]['projects'].map(item => item.id)
        );
        setProjectList(fetchDataWhenIsUpdateResponse[1]);
        setCancerList(
          fetchDataWhenIsUpdateResponse[2].map(({ id, name }) => ({
            value: id,
            text: name,
          }))
        );
      } else if (!isUpdate) {
        setFormInitialData(initialFormData);
      }
    }
  }, [isUpdate, fetchDataWhenIsUpdateResponse, fetchDataWhenIsUpdateError]);

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

  const [
    { error: submitError, response: updateDoctorResponse },
    submit,
  ] = useRequest(submitCb);

  const copySuccess = () => Message.success('复制成功');

  const [showPwdModal, setShowPwdModal] = useState(false);

  const handleModalClose = () => {
    setShowPwdModal(false);
    goDoctorList();
  };

  useEffect(() => {
    if (submitError.status === 1) {
      Message.success('操作异常！');
    } else if (submitError.status === 0) {
      Message.success(isUpdate ? '修改成功！' : '添加成功！').then(() => {
        setShowPwdModal(true);
      });
    }
  }, [submitError, isUpdate]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        // name field is untouched and not empty or in edit
        // and name equal edit init name
        delete values.isRegister;
        return submit(params.doctor_id, {
          ...values,
          project_ids: selectedRowKeys,
        });
      })
      .catch(error => {});
  };

  const [current, setCurrent] = useState(1);

  const handlePageChange = e => setCurrent(e);

  const [searchText, setSearchText] = useState('');
  const projectTableIdSearchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = useCallback(
    dataIndex => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={projectTableIdSearchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type='primary'
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size='small'
              style={{ width: 90 }}
            >
              搜索
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size='small'
              style={{ width: 90 }}
            >
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        return record[dataIndex] === +value;
      },
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => projectTableIdSearchInput.current.focus(), 100);
        }
      },
      render: text => text,
    }),
    []
  );

  const tableColumns = useMemo(() => {
    if (isUpdate === null) return [];
    if (isUpdate) {
      return [
        {
          title: 'id',
          dataIndex: 'id',
          align: 'center',
          width: 50,
          sorter: (prevId, nextId) => {
            return prevId.id - nextId.id;
          },
          sortDirections: ['descend', 'ascend'],
          ...getColumnSearchProps('id'),
        },
        {
          title: '项目描述',
          dataIndex: 'description',
          align: 'center',
          width: 240,
          render: input => input || 0,
        },
        {
          title: '所属病症',
          dataIndex: 'cancer',
          align: 'center',
          width: 120,
          render: input => input.name || 0,
          filters: cancerList,
          onFilter: (value, record) => {
            return value === record.cancer.id;
          },
        },
        {
          title: '提交人数',
          dataIndex: 'submit_patients_num',
          align: 'center',
          render: input => input || 0,
        },
        {
          title: '入组人数',
          dataIndex: 'accept_patients_num',
          align: 'center',
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
    }
  }, [cancerList, isUpdate, getColumnSearchProps]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: selected => setSelectedRowKeys(selected),
    }),
    [selectedRowKeys]
  );
  return (
    <div className='doctor-form-layer'>
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
          {isUpdate && (
            <Item label='微信绑定' name='isRegister' valuePropName='checked'>
              <Switch
                disabled
                checkedChildren='已绑定'
                unCheckedChildren='未绑定'
              />
            </Item>
          )}
          <Item label='职称' name='position'>
            <Input />
          </Item>
          <Item label='管理员' name='isAdmin' valuePropName='checked'>
            <Switch checkedChildren='是' unCheckedChildren='否' />
          </Item>
          <Item label='联系电话' name='telphone'>
            <Input />
          </Item>
          <Item label='手机号' name='mobile_phone'>
            <Input />
          </Item>
          <Item label='门诊时间' name='visit_time'>
            <Input />
          </Item>
          {projectList.length > 0 && (
            <Item label='负责项目' name='project_ids' wrapperCol={{ span: 16 }}>
              <Table
                rowKey='id'
                bordered
                rowSelection={rowSelection}
                columns={tableColumns}
                dataSource={projectList || []}
                className='table'
                pagination={{
                  current: current,
                  pageSize: 5,
                  showSizeChanger: false,
                  hideOnSinglePage: true,
                  onChange: handlePageChange,
                }}
              ></Table>
            </Item>
          )}
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

      <Modal
        title='医生管理'
        visible={showPwdModal}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        maskClosable={false}
      >
        {updateDoctorResponse && (
          <div>
            <p>
              账号：
              <Tag color='success'>{updateDoctorResponse.name}</Tag>
              <Clipboard
                title='复制账号至剪切板'
                component='span'
                onSuccess={copySuccess}
                data-clipboard-text={updateDoctorResponse.name}
              >
                <Button>复制账号至剪切板</Button>
              </Clipboard>
            </p>
            <p>
              密码：
              <Tag color='success'>{updateDoctorResponse.password}</Tag>
              <Clipboard
                title='复制密码至剪切板'
                component='span'
                onSuccess={copySuccess}
                data-clipboard-text={updateDoctorResponse.password}
              >
                <Button>复制密码至剪切板</Button>
              </Clipboard>
            </p>
            <p>
              医生账号为<strong>医生姓名</strong>，密码可
              <strong>医生详情</strong>中查看
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
