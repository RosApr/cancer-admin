import React, { useCallback, useState, useEffect } from 'react';
import { Table, Button, Descriptions } from 'antd';
import moment from 'moment';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
import { fetchPatientListApi, fetchPatientDetailApi } from '@/api/patient';
import { useRequest } from '@/utils/requestHook';
import { makeTableFilterParams } from '@/utils/common';
import {
  PATIENT_ACCEPT_TAG_CONFIG,
  PATIENT_ACCEPT_CONDITION,
  WECHAT_REGISTER_TAG_CONFIG,
} from '@/utils/consts';
import './index.scss';

const makeTableColumns = (
  handleShowPatientClickBtn = () => {},
  expandedRowKeys = []
) => [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '病情描述 ',
    dataIndex: 'illness_description',
    align: 'left',
  },
  {
    title: '入组情况',
    dataIndex: 'isAccepted',
    align: 'center',
    width: 120,
    filters: PATIENT_ACCEPT_CONDITION,
    onFilter: (condition, record) => record.isAccepted === condition,
    render: input => PATIENT_ACCEPT_TAG_CONFIG[input],
  },
  {
    title: '电话',
    dataIndex: 'telphone',
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'id',
    render: input => {
      return (
        <Button
          type={`${expandedRowKeys.includes(input) ? 'default' : 'primary'}`}
          onClick={() => handleShowPatientClickBtn(input)}
        >
          {expandedRowKeys.includes(input) ? '收起' : '查看'}
        </Button>
      );
    },
  },
];

const today = moment().endOf('day');

const filterFormConfig = [
  {
    key: 'name',
    defaultValue: '',
    placeholder: '请输入病人名称',
    isFullMatch: false,
    value: '',
  },
  {
    key: 'date_range',
    defaultValue: null,
    placeholder: '请输入病人名称',
    isFullMatch: false,
    type: 'rangePicker',
    value: null,
    disabledDate: current => {
      return current && current > today;
    },
    format: 'YYYY-MM-DD',
  },
];

const patientListConfig = {
  list: [],
  total: 0,
};

const formatParams = (params = {}) => {
  const formatParams = {};
  for (let [key, value] of Object.entries(params)) {
    if (!Array.isArray(value) && value) {
      formatParams[key] = value;
    }
    if (key === 'date_range' && Array.isArray(value) && value.length > 0) {
      formatParams['start_date'] = params.date_range[0].format('YYYY-MM-DD');
      formatParams['end_date'] = params.date_range[1].format('YYYY-MM-DD');
    }
  }
  return formatParams;
};

export default function PatientList() {
  const [patientList, setPatientList] = useState(() => patientListConfig);
  const [current, setCurrent] = useState(1);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [params, setParams] = useState(() => {
    const filterParams = makeTableFilterParams(filterFormConfig);
    const _params = formatParams(filterParams);
    return {
      canFetchData: true,
      ..._params,
    };
  });
  // fire table filter condition change
  const handleFilterChange = useCallback(currentFilters => {
    setParams(prev => {
      if (prev.hasOwnProperty('start_date')) {
        delete prev.start_date;
        delete prev.end_date;
      }
      return {
        ...formatParams({ ...prev, ...currentFilters }),
        canFetchData: true,
      };
    });
    setCurrent(1);
    setPatientList(patientListConfig);
  }, []);

  const fetchPatientDetailCallback = useCallback(patientId => {
    return fetchPatientDetailApi(patientId);
  }, []);

  const [
    {
      error: fetchPatientDetailError,
      response: fetchPatientDetailResponse,
      requestData: fetchPatientDetailRequestData,
    },
    fetchPatientDetail,
  ] = useRequest(fetchPatientDetailCallback);

  useEffect(() => {
    if (fetchPatientDetailError.status === 0 && fetchPatientDetailResponse) {
      // todo
      const _list = [...patientList.list];
      const currentPatientConfig = _list.find(
        item => item.id === fetchPatientDetailRequestData
      );
      currentPatientConfig['_detail'] = fetchPatientDetailResponse;
      setPatientList(prev => ({
        ...prev,
        list: _list,
      }));
      fetchPatientDetailError.status = 2;
    }
  }, [
    patientList,
    fetchPatientDetailError,
    fetchPatientDetailResponse,
    fetchPatientDetailRequestData,
  ]);

  const handleShowPatientDetail = patientId => {
    const currentPatientConfig = patientList.list.find(
      item => item.id === patientId
    );
    const isAlreadyFetchDetail = currentPatientConfig.hasOwnProperty('_detail');
    let _expandedRowKeys = [...expandedRowKeys];
    if (isAlreadyFetchDetail) {
      const index = _expandedRowKeys.findIndex(item => item === patientId);
      if (index >= 0) {
        _expandedRowKeys.splice(index, 1);
      } else {
        _expandedRowKeys = [..._expandedRowKeys, patientId];
      }
    } else {
      _expandedRowKeys = [..._expandedRowKeys, patientId];
      fetchPatientDetail(patientId);
    }
    setExpandedRowKeys(_expandedRowKeys);
  };
  const fetchPatientListCallback = useCallback(params => {
    return fetchPatientListApi(params);
  }, []);

  const [
    {
      error: fetchPatientListError,
      response: fetchPatientListResponse,
      isLoading: fetchPatientListLoading,
    },
    fetchPatientList,
  ] = useRequest(fetchPatientListCallback);

  useEffect(() => {
    if (fetchPatientListError.status === 0 && fetchPatientListResponse) {
      const list = fetchPatientListResponse;
      setPatientList({
        list: list,
        total: list.length || 0,
      });
    }
  }, [fetchPatientListError, fetchPatientListResponse]);

  useEffect(() => {
    const { canFetchData, ...formData } = params;
    if (canFetchData) {
      setParams(prev => ({
        ...prev,
        canFetchData: false,
      }));
      fetchPatientList(formData);
    }
  }, [params, fetchPatientList]);

  const tableColumns = makeTableColumns(
    handleShowPatientDetail,
    expandedRowKeys
  );

  return (
    <div className='patient-manage-layer'>
      <TableFilterContainer
        left={() => {
          return (
            <ListFilterForm
              config={filterFormConfig}
              onSearch={handleFilterChange}
            />
          );
        }}
      />
      <Table
        loading={fetchPatientListLoading}
        rowKey='id'
        bordered
        columns={tableColumns}
        dataSource={patientList.list}
        className='table'
        expandable={{
          expandedRowKeys: expandedRowKeys,
          expandIconColumnIndex: -1,
          rowExpandable: record => record.hasOwnProperty('_detail'),
          expandedRowRender: record => {
            const {
              _detail: {
                id_card = '',
                bank_address = '',
                bank_card_num = '',
                bank_name = '',
                exit_time = '',
                isRegisterWechat = false,
                project_id = '',
              },
            } = record;
            return (
              <Descriptions style={{ marginLeft: '10%' }}>
                <Descriptions.Item label='身份证号'>
                  {id_card}
                </Descriptions.Item>
                <Descriptions.Item label='银行名称'>
                  {bank_name}
                </Descriptions.Item>
                <Descriptions.Item label='开户行地址'>
                  {bank_address}
                </Descriptions.Item>
                <Descriptions.Item label='银行卡号'>
                  {bank_card_num}
                </Descriptions.Item>
                <Descriptions.Item label='微信绑定'>
                  {WECHAT_REGISTER_TAG_CONFIG[isRegisterWechat]}
                </Descriptions.Item>
                <Descriptions.Item label='项目ID'>
                  {project_id}
                </Descriptions.Item>
                <Descriptions.Item label='出组时间'>
                  {exit_time}
                </Descriptions.Item>
              </Descriptions>
            );
          },
        }}
        pagination={{
          current: current,
          pageSize: 10,
          showSizeChanger: false,
          hideOnSinglePage: true,
          onChange: setCurrent,
        }}
      ></Table>
    </div>
  );
}
