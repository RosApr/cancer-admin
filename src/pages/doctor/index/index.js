import React, { useCallback, useState, useEffect } from 'react';
import { Button, Table, Space, Popconfirm } from 'antd';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
import { fetchDoctorListApi, delDoctorApi } from '@/api/doctor';
import { useNavigate, useRequest, useRequestResult } from '@/utils/requestHook';
import { initTableFilterConfig, makeTableFilterParams } from '@/utils/common';
import {
  WECHAT_REGISTER_TAG_CONFIG,
  USER_ROLE_CONFIG,
  ROLE_TAG_CONFIG,
} from '@/utils/consts';
import './index.scss';

const makeTableColumns = (
  goView = () => {},
  goEdit = () => {},
  del = () => {}
) => [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: 50,
  },
  {
    title: '医生姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '职称',
    dataIndex: 'position',
    align: 'center',
  },
  {
    title: '管理员',
    dataIndex: 'role_id',
    align: 'center',
    filters: USER_ROLE_CONFIG,
    onFilter: (condition, record) => record.role_id === condition,
    render: input => ROLE_TAG_CONFIG[input],
  },
  {
    title: '联系电话',
    dataIndex: 'telphone',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'mobile_phone',
    align: 'center',
  },
  {
    title: '门诊时间',
    dataIndex: 'visit_time',
    align: 'center',
  },
  {
    title: '微信绑定',
    dataIndex: 'isRegister',
    align: 'center',
    width: 150,
    render: input => WECHAT_REGISTER_TAG_CONFIG[input],
  },

  {
    title: '操作',
    dataIndex: 'id',
    width: 280,
    render: (input, { name }) => {
      return (
        <Space size='middle'>
          <Button onClick={() => goView(input)}>查看</Button>
          <Button type='primary' onClick={() => goEdit(input)}>
            编辑
          </Button>
          <Popconfirm
            onConfirm={() => del(input)}
            placement='bottomRight'
            cancelText='取消'
            okText='确认'
            title={`确认要删除${name}医生吗？`}
          >
            <Button type='danger'>删除</Button>
          </Popconfirm>
        </Space>
      );
    },
  },
];

const filterFormConfig = [
  {
    key: 'name',
    defaultValue: '',
    placeholder: '请输入医生名称',
    isFullMatch: false,
    value: '',
  },
  // {
  //   key: 'isAdmin',
  //   defaultValue: '',
  //   isFullMatch: true,
  //   value: '',
  //   placeholder: '请选择医生类别',
  //   list: [
  //     {
  //       id: '',
  //       name: '全部',
  //     },
  //     {
  //       id: true,
  //       name: '管理员',
  //     },
  //     {
  //       id: false,
  //       name: '非管理员',
  //     },
  //   ],
  // },
];

const doctorListConfig = {
  list: [],
  total: 0,
};

export default function Dashboard() {
  const { history } = useNavigate();

  const [doctorList, setDoctorList] = useState(() => doctorListConfig);
  const [current, setCurrent] = useState(1);
  const [init, setInit] = useState(false);

  // init table filter campaign select list
  const [tableFilter, setTableFilter] = useState(() => {
    return initTableFilterConfig(filterFormConfig);
  });

  // fire table filter condition change
  const handleFilterChange = useCallback(currentFilters => {
    setTableFilter(prev => {
      const formatFilters = prev.map(item => {
        return {
          ...item,
          value: currentFilters[item['key']],
        };
      });
      return formatFilters;
    });
    setInit(false);
    setCurrent(1);
    setDoctorList(doctorListConfig);
  }, []);

  const fetchDoctorListCallback = useCallback(() => {
    const fetchParams = {
      ...makeTableFilterParams(tableFilter),
    };
    return fetchDoctorListApi(fetchParams);
  }, [tableFilter]);

  const [
    {
      error: fetchDoctorListError,
      response: fetchDoctorListResponse,
      isLoading: fetchDoctorListLoading,
    },
    fetchDoctorList,
  ] = useRequest(fetchDoctorListCallback);

  useEffect(() => {
    if (fetchDoctorListError.status === 0 && fetchDoctorListResponse) {
      const list = fetchDoctorListResponse;
      setDoctorList({
        list: list,
        total: list.length || 0,
      });
    }
  }, [fetchDoctorListError, fetchDoctorListResponse]);

  const handlePageChange = e => {
    setCurrent(e);
  };

  useEffect(() => {
    if (tableFilter && !init) {
      fetchDoctorList();
      setInit(true);
    }
  }, [tableFilter, init, fetchDoctorList]);

  const goAdd = () => {
    return history.push(`/app/doctor/form/add`);
  };

  const goEdit = doctorId => {
    return history.push(`/app/doctor/form/update/${doctorId}`);
  };

  const goView = doctorId => {
    return history.push(`/app/doctor/view/${doctorId}`);
  };

  const delDoctorCallback = useCallback(doctorId => {
    return delDoctorApi(doctorId);
  }, []);

  const [
    {
      error: delDoctorError,
      response: delDoctorResponse,
      requestData: delDoctorRequestData,
    },
    delDoctor,
  ] = useRequest(delDoctorCallback);

  useRequestResult({
    response: delDoctorResponse,
    requestData: delDoctorRequestData,
    error: delDoctorError,
    cb: requestData => {
      const _doctorList = [...doctorList.list];
      _doctorList.splice(
        _doctorList.findIndex(({ id }) => id === requestData),
        1
      );
      setDoctorList({
        list: _doctorList,
        total: _doctorList.length || 0,
      });
      delDoctorError.status = 2;
    },
  });

  const tableColumns = makeTableColumns(goView, goEdit, delDoctor);
  return (
    <div className='dashboard-layer'>
      {tableFilter && (
        <TableFilterContainer
          left={() => {
            return (
              <ListFilterForm
                config={filterFormConfig}
                onSearch={handleFilterChange}
              />
            );
          }}
          right={() => {
            return (
              <Button type='primary' onClick={goAdd}>
                添加医生
              </Button>
            );
          }}
        />
      )}
      <Table
        loading={fetchDoctorListLoading}
        rowKey='id'
        bordered
        columns={tableColumns}
        dataSource={doctorList.list}
        className='table'
        pagination={{
          current: current,
          pageSize: 10,
          // total: doctorList.total,
          showSizeChanger: false,
          hideOnSinglePage: false,
          onChange: handlePageChange,
        }}
      ></Table>
    </div>
  );
}
