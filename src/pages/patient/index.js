import React, { useCallback, useState, useEffect } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
import { fetchPatientListApi } from '@/api/patient';
import { useRequest } from '@/utils/requestHook';
import { makeTableFilterParams } from '@/utils/common';
import {
  PATIENT_ACCEPT_TAG_CONFIG,
  PATIENT_ACCEPT_CONDITION,
} from '@/utils/consts';
import './index.scss';

const makeTableColumns = () => [
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
];

const today = +moment().endOf('day');

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
      return current && +current > today;
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

export default function Dashboard() {
  const [patientList, setPatientList] = useState(() => patientListConfig);
  const [current, setCurrent] = useState(1);
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

  const tableColumns = makeTableColumns();

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
