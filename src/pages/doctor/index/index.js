import React, { useCallback, useState, useEffect } from 'react';
import { Button, Table, Space, Popconfirm } from 'antd';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
// import { fetchCancersApi } from '@/api/cancer';
import { fetchDoctorListApi } from '@/api/doctor';
import {
  useNavigate,
  useFetchDataOnMount,
  useRequest,
  useRequestResult,
} from '@/utils/requestHook';
import { initTableFilterConfig, makeTableFilterParams } from '@/utils/common';
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
    title: '项目描述',
    dataIndex: 'description',
    align: 'left',
    render: input => input || '等待回填',
  },
  {
    title: '负责医生',
    dataIndex: 'person_in_charge',
    align: 'center',
    width: 120,
    render: input => input || '等待回填',
  },
  {
    title: '提交人数',
    dataIndex: 'submit_patients_num',
    align: 'center',
    width: 120,
    render: input => input || 0,
  },
  {
    title: '入组人数',
    dataIndex: 'accept_patients_num',
    align: 'center',
    width: 120,
    render: input => input || 0,
  },
  {
    title: '创建日期',
    dataIndex: 'create_time',
    align: 'center',
    width: 150,
    render: input => input || '等待回填',
  },
  {
    title: '更新日期',
    dataIndex: 'update_time',
    align: 'center',
    width: 150,
    render: input => input || '等待回填',
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: 280,
    render: (id, { cancer: { id: cancerId } }) => {
      return (
        <Space size='middle'>
          <Button onClick={() => goView(cancerId, id)}>查看</Button>
          {/* <Button type='primary' onClick={() => goEdit(cancerId, id)}>
            编辑
          </Button>
          <Popconfirm
            onConfirm={() => del(id)}
            placement='bottomRight'
            cancelText='取消'
            okText='确认'
            title={`确认要删除${id}号项目吗？`}
          >
            <Button type='danger'>删除</Button>
          </Popconfirm> */}
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

  // const fetchCancerListCallback = useCallback(() => {
  //   return fetchCancersApi();
  // }, []);
  // const {
  //   response: fetchCancerListResponse,
  //   error: fetchCancerListError,
  // } = useFetchDataOnMount(fetchCancerListCallback);
  // init table filter campaign select list
  const [tableFilter, setTableFilter] = useState(() => {
    return initTableFilterConfig(filterFormConfig);
  });

  // useEffect(() => {
  //   if (fetchCancerListError.status === 0 && fetchCancerListResponse) {
  //     const cancerSelect = filterFormConfig.filter(
  //       item => item.key === 'cancer_id'
  //     )[0];
  //     cancerSelect['list'] = [
  //       { id: 0, name: '全部' },
  //       ...fetchCancerListResponse,
  //     ];
  //     setTableFilter(initTableFilterConfig(filterFormConfig));
  //   }
  // }, [fetchCancerListResponse, fetchCancerListError]);

  // fire table filter condition change
  const handleFilterChange = useCallback(
    currentFilters => {
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
    },
    [setTableFilter]
  );

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
    console.log(tableFilter);
    console.log(init);
    if (tableFilter && !init) {
      fetchDoctorList();
      setInit(true);
    }
  }, [tableFilter, init, fetchDoctorList]);

  const goAdd = () => {
    return history.push(`/app/doctor/form/add`);
  };

  const goView = (cancerId, doctorId) => {
    return history.push(`/app/doctor/view/${cancerId}/${doctorId}`);
  };

  // const goEdit = (cancerId, doctorId) => {
  //   return history.push(`/app/doctor/form/update/${cancerId}/${doctorId}`);
  // };

  // const delDoctorCallback = useCallback(doctorId => {
  //   return delDoctorApi(doctorId);
  // }, []);

  // const [
  //   {
  //     error: delDoctorError,
  //     response: delDoctorResponse,
  //     requestData: delDoctorRequestData,
  //   },
  //   delDoctor,
  // ] = useRequest(delDoctorCallback);

  // useEffect(() => {
  //   if (delDoctorError.status === 0 && delDoctorResponse) {
  //     const _doctorList = [...doctorList.list];
  //     _doctorList.splice(
  //       _doctorList.findIndex(({ id }) => id === delDoctorRequestData),
  //       1
  //     );
  //     setDoctorList({
  //       list: _doctorList,
  //       total: _doctorList.length || 0,
  //     });
  //     delDoctorError.status = 2;
  //   }
  // }, [delDoctorError, doctorList, delDoctorResponse, delDoctorRequestData]);

  // useRequestResult({
  //   response: delDoctorResponse,
  //   requestData: delDoctorRequestData,
  //   error: delDoctorError,
  //   cb: requestData => {
  //     const _doctorList = [...doctorList.list];
  //     _doctorList.splice(
  //       _doctorList.findIndex(({ id }) => id === requestData),
  //       1
  //     );
  //     setDoctorList({
  //       list: _doctorList,
  //       total: _doctorList.length || 0,
  //     });
  //     delDoctorError.status = 2;
  //   },
  // });

  // const del = doctorId => {
  //   delDoctor(doctorId);
  // };

  // const tableColumns = makeTableColumns(goEdit, goView, del);
  const tableColumns = makeTableColumns(goView);
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
          total: doctorList.total,
          showSizeChanger: false,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
      ></Table>
    </div>
  );
}
