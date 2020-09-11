import React, { useCallback, useState, useEffect } from 'react';
import { Button, Table, Space, Popconfirm } from 'antd';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
import { fetchCancersApi } from '@/api/cancer';
import { fetchProjectListApi, delProjectApi } from '@/api/project';
import {
  useNavigate,
  useFetchDataOnMount,
  useRequest,
  useRequestResult,
} from '@/utils/requestHook';
import { initTableFilterConfig, makeTableFilterParams } from '@/utils/common';
import './index.scss';

const makeTableColumns = (
  goEdit = () => {},
  goView = () => {},
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
          <Button type='primary' onClick={() => goEdit(cancerId, id)}>
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
          </Popconfirm>
        </Space>
      );
    },
  },
];

const filterFormConfig = [
  {
    key: 'cancer_id',
    list: [],
    defaultValue: 0,
    placeholder: '请选择癌症',
    isFullMatch: true,
    value: 0,
  },
  {
    key: 'description',
    defaultValue: '',
    placeholder: '请输入项目描述',
    isFullMatch: false,
    value: '',
  },
  {
    key: 'exclusion',
    defaultValue: '',
    placeholder: '请输入项目排除标准',
    isFullMatch: false,
    value: '',
  },
  {
    key: 'acceptance',
    defaultValue: '',
    placeholder: '请输入项目入组标准',
    isFullMatch: false,
    value: '',
  },
];

const projectListConfig = {
  list: [],
  total: 0,
};

export default function Dashboard() {
  const { history } = useNavigate();

  const [projectList, setProjectList] = useState(() => projectListConfig);
  const [current, setCurrent] = useState(1);
  const [init, setInit] = useState(false);

  const fetchCancerListCallback = useCallback(() => {
    return fetchCancersApi();
  }, []);
  const {
    response: fetchCancerListResponse,
    error: fetchCancerListError,
  } = useFetchDataOnMount(fetchCancerListCallback);
  // init table filter campaign select list
  const [tableFilter, setTableFilter] = useState(null);

  useEffect(() => {
    if (fetchCancerListError.status === 0 && fetchCancerListResponse) {
      const cancerSelect = filterFormConfig.filter(
        item => item.key === 'cancer_id'
      )[0];
      cancerSelect['list'] = [
        { id: 0, name: '全部' },
        ...fetchCancerListResponse,
      ];
      setTableFilter(initTableFilterConfig(filterFormConfig));
    }
  }, [fetchCancerListResponse, fetchCancerListError]);

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
      setProjectList(projectListConfig);
    },
    [setTableFilter]
  );

  const fetchProjectListCallback = useCallback(() => {
    const fetchParams = {
      ...makeTableFilterParams(tableFilter),
    };
    return fetchProjectListApi(fetchParams);
  }, [tableFilter]);

  const [
    {
      error: fetchProjectListError,
      response: fetchProjectListResponse,
      isLoading: fetchProjectListLoading,
    },
    fetchProjectList,
  ] = useRequest(fetchProjectListCallback);

  useEffect(() => {
    if (fetchProjectListError.status === 0 && fetchProjectListResponse) {
      const list = fetchProjectListResponse;
      setProjectList({
        list: list,
        total: list.length || 0,
      });
    }
  }, [fetchProjectListError, fetchProjectListResponse]);

  const handlePageChange = e => {
    setCurrent(e);
  };

  useEffect(() => {
    if (tableFilter && !init) {
      fetchProjectList();
      setInit(true);
    }
  }, [tableFilter, init, fetchProjectList]);

  const goAdd = () => {
    return history.push(`/app/project/form/add`);
  };

  const goView = (cancerId, projectId) => {
    return history.push(`/app/project/view/${cancerId}/${projectId}`);
  };

  const goEdit = (cancerId, projectId) => {
    return history.push(`/app/project/form/update/${cancerId}/${projectId}`);
  };

  const delProjectCallback = useCallback(projectId => {
    return delProjectApi(projectId);
  }, []);

  const [
    {
      error: delProjectError,
      response: delProjectResponse,
      requestData: delProjectRequestData,
    },
    delProject,
  ] = useRequest(delProjectCallback);

  useRequestResult({
    response: delProjectResponse,
    requestData: delProjectRequestData,
    error: delProjectError,
    cb: requestData => {
      const _projectList = [...projectList.list];
      _projectList.splice(
        _projectList.findIndex(({ id }) => id === requestData),
        1
      );
      setProjectList({
        list: _projectList,
        total: _projectList.length || 0,
      });
      delProjectError.status = 2;
    },
  });

  const del = projectId => {
    delProject(projectId);
  };

  const tableColumns = makeTableColumns(goEdit, goView, del);
  return (
    <div className='dashboard-layer'>
      {fetchCancerListResponse && tableFilter && (
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
                添加项目
              </Button>
            );
          }}
        />
      )}
      <Table
        loading={fetchProjectListLoading}
        rowKey='id'
        bordered
        columns={tableColumns}
        dataSource={projectList.list}
        className='table'
        pagination={{
          current: current,
          pageSize: 10,
          total: projectList.total,
          showSizeChanger: false,
          hideOnSinglePage: true,
          onChange: handlePageChange,
        }}
      ></Table>
    </div>
  );
}
