import React, { useCallback, useState, useEffect } from 'react';
import { Button, Table, Space, Popconfirm, Tag } from 'antd';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
import { fetchCancerListApi, delCancerApi } from '@/api/cancer';
import { useNavigate, useRequest, useRequestResult } from '@/utils/requestHook';
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
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'id',
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
            title={`确认要删除${name}吗？`}
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
    placeholder: '请输入癌症名称',
    isFullMatch: false,
    value: '',
  },
];

const cancerListConfig = {
  list: [],
  total: 0,
};

export default function Dashboard() {
  const { history } = useNavigate();

  const [cancerList, setDoctorList] = useState(() => cancerListConfig);
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
      setDoctorList(cancerListConfig);
    },
    [setTableFilter]
  );

  const fetchDoctorListCallback = useCallback(() => {
    const fetchParams = {
      ...makeTableFilterParams(tableFilter),
    };
    return fetchCancerListApi(fetchParams);
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
    return history.push(`/app/cancer/form/add`);
  };

  const goEdit = cancerId => {
    return history.push(`/app/cancer/form/update/${cancerId}`);
  };

  const goView = cancerId => {
    return history.push(`/app/cancer/view/${cancerId}`);
  };

  const delDoctorCallback = useCallback(cancerId => {
    return delCancerApi(cancerId);
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
      const _cancerList = [...cancerList.list];
      _cancerList.splice(
        _cancerList.findIndex(({ id }) => id === requestData),
        1
      );
      setDoctorList({
        list: _cancerList,
        total: _cancerList.length || 0,
      });
      delDoctorError.status = 2;
    },
  });

  const del = cancerId => {
    delDoctor(cancerId);
  };

  // const tableColumns = makeTableColumns(goEdit, goView, del);
  const tableColumns = makeTableColumns(goView, goEdit, del);
  return (
    <div className='cancer-manage-layer'>
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
                添加癌症
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
        dataSource={cancerList.list}
        className='table'
        pagination={{
          current: current,
          pageSize: 10,
          total: cancerList.total,
          showSizeChanger: false,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
      ></Table>
    </div>
  );
}
