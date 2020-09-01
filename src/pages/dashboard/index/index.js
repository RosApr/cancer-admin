import React, { useCallback, useState, useEffect } from 'react';
import { Button, Row, Col, Table } from 'antd';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
import { fetchCancersApi } from '@/api/cancer';
import { fetchProjectListApi } from '@/api/project';
import {
  useNavigate,
  useFetchDataOnMount,
  useRequest,
} from '@/utils/requestHook';
import { initTableFilterConfig, makeTableFilterParams } from '@/utils/common';
import './index.scss';
import { set } from 'js-cookie';

const filterFormConfig = [
  {
    key: 'cancer_id',
    list: [],
    defaultValue: '',
    placeholder: '请选择癌症',
    isFullMatch: true,
    value: '',
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

export default function Dashboard() {
  const { history } = useNavigate();

  const [projectList, setProjectList] = useState([]);
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
      cancerSelect['list'] = fetchCancerListResponse;
      cancerSelect['defaultValue'] = fetchCancerListResponse[0]['id'];
      cancerSelect['value'] = fetchCancerListResponse[0]['id'];
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
      console.log(fetchProjectListResponse);
      // const { items, total } = fetchProjectListResponse;
      // setProjectList(prev => ({
      //   list: [...prev.list, ...items],
      //   total: total,
      // }));
    }
  }, [fetchProjectListError, fetchProjectListResponse]);

  useEffect(() => {
    if (tableFilter && !init) {
      fetchProjectList();
      setInit(true);
    }
  }, [tableFilter, init, fetchProjectList]);

  const goAdd = () => {
    return history.push(`/app/solution/basic/add`);
  };
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
                添加策略
              </Button>
            );
          }}
        />
      )}
    </div>
  );
}
