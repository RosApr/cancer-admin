import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Table,
  Space,
  Popconfirm,
  Tooltip,
  Form,
  Modal,
  Input,
} from 'antd';
import TableFilterContainer from '@/components/tableBar';
import ListFilterForm from '@/components/listFilterForm';
import {
  fetchNewsListApi,
  delNewsApi,
  updateNewsApi,
  fetchNewsDetailApi,
  addNewsApi,
} from '@/api/news';
import { useRequest, useRequestResult } from '@/utils/requestHook';
import { makeTableFilterParams } from '@/utils/common';
import './index.scss';

const formInitialData = {
  title: '',
  url: '',
};
const makeTableColumns = (goEdit = () => {}, del = () => {}) => [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: 50,
  },
  {
    title: '标题',
    dataIndex: 'title',
    align: 'left',
  },
  {
    title: '链接',
    dataIndex: 'url',
    align: 'center',
    className: 'url-btn',
    render: input => (
      <Tooltip title='点击跳转查看文章详情'>
        <Button href={input} target='_blank' type='link'>
          {input}
        </Button>
      </Tooltip>
    ),
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: 280,
    render: input => {
      return (
        <Space size='middle'>
          <Button type='primary' onClick={() => goEdit(input)}>
            编辑
          </Button>
          <Popconfirm
            onConfirm={() => del(input)}
            placement='bottomRight'
            cancelText='取消'
            okText='确认'
            title={`确认要删除该文章吗？`}
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
    key: 'title',
    defaultValue: '',
    placeholder: '请输入标题',
    isFullMatch: false,
    value: '',
  },
];

const newsListConfig = {
  list: [],
  total: 0,
};

export default function NewsIndex() {
  const [newsList, setNewsList] = useState(() => newsListConfig);
  const [current, setCurrent] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalDetail, setModalDetail] = useState(null);
  const [params, setParams] = useState(() => {
    return {
      canFetchData: true,
      ...makeTableFilterParams(filterFormConfig),
    };
  });
  const fetchNewsDetailCallback = useCallback(id => {
    return fetchNewsDetailApi(id);
  }, []);

  const [
    { response: fetchNewsDetailResponse, error: fetchNewsDetailError },
    fetchNewsDetail,
  ] = useRequest(fetchNewsDetailCallback);

  const [form] = Form.useForm();

  useEffect(() => {
    if (
      fetchNewsDetailError.status === 0 &&
      fetchNewsDetailResponse &&
      !showModal
    ) {
      fetchNewsDetailError.status = 2;
      setModalDetail(fetchNewsDetailResponse);
      form.setFieldsValue(fetchNewsDetailResponse);
      setShowModal(true);
    }
  }, [form, fetchNewsDetailError, fetchNewsDetailResponse, showModal]);

  const updateOrAddNewsCallback = useCallback(
    data => {
      return modalDetail
        ? updateNewsApi(modalDetail.id, data)
        : addNewsApi(data);
    },
    [modalDetail]
  );

  const [
    {
      response: updateOrAddNewsResponse,
      error: updateOrAddNewsError,
      isLoading: updateOrAddNewsLoading,
    },
    updateOrAddNews,
  ] = useRequest(updateOrAddNewsCallback);

  useRequestResult({
    response: updateOrAddNewsResponse,
    error: updateOrAddNewsError,
    cb: () => {
      const _newsList = [...newsList.list];
      setShowModal(false);
      if (modalDetail) {
        const index = newsList.list.findIndex(
          item => item.id === modalDetail.id
        );
        _newsList.splice(index, 1, updateOrAddNewsResponse);
      } else {
        _newsList.push(updateOrAddNewsResponse);
      }
      setModalDetail(null);
      setNewsList({
        list: _newsList,
        total: _newsList.length || 0,
      });
    },
  });

  const submitNews = () => {
    form
      .validateFields()
      .then(async values => {
        return updateOrAddNews(values);
      })
      .catch(error => {});
  };

  // fire table filter condition change
  const handleFilterChange = useCallback(currentFilters => {
    setParams(prev => {
      return {
        ...prev,
        ...currentFilters,
        canFetchData: true,
      };
    });
    setCurrent(1);
    setNewsList(newsListConfig);
  }, []);

  const fetchNewsListCallback = useCallback(params => {
    return fetchNewsListApi(params);
  }, []);

  const [
    {
      error: fetchNewsListError,
      response: fetchNewsListResponse,
      isLoading: fetchNewsListLoading,
    },
    fetchNewsList,
  ] = useRequest(fetchNewsListCallback);

  useEffect(() => {
    if (fetchNewsListError.status === 0 && fetchNewsListResponse) {
      const list = fetchNewsListResponse;
      setNewsList({
        list: list,
        total: list.length || 0,
      });
    }
  }, [fetchNewsListError, fetchNewsListResponse]);

  useEffect(() => {
    const { canFetchData, ...formData } = params;
    if (canFetchData) {
      setParams(prev => ({
        ...prev,
        canFetchData: false,
      }));
      fetchNewsList(formData);
    }
  }, [params, fetchNewsList]);

  const delNewsCallback = useCallback(newsId => {
    return delNewsApi(newsId);
  }, []);

  const [
    {
      error: delNewsError,
      response: delNewsResponse,
      requestData: delNewsRequestData,
    },
    delNews,
  ] = useRequest(delNewsCallback);

  useRequestResult({
    response: delNewsResponse,
    requestData: delNewsRequestData,
    error: delNewsError,
    cb: requestData => {
      const _newsList = [...newsList.list];
      _newsList.splice(
        _newsList.findIndex(({ id }) => id === requestData),
        1
      );
      setNewsList({
        list: _newsList,
        total: _newsList.length || 0,
      });
    },
  });

  useEffect(() => {
    if (!showModal) {
      form.resetFields(['url', 'title']);
    }
  }, [showModal, form]);

  const tableColumns = makeTableColumns(fetchNewsDetail, delNews);

  return (
    <div className='news-layer'>
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
            <Button
              type='primary'
              onClick={() => {
                setModalDetail(null);
                setShowModal(true);
              }}
            >
              添加文章
            </Button>
          );
        }}
      />
      <Table
        loading={fetchNewsListLoading}
        rowKey='id'
        bordered
        columns={tableColumns}
        dataSource={newsList.list}
        className='table'
        pagination={{
          current: current,
          pageSize: 10,
          // total: newsList.total,
          showSizeChanger: false,
          hideOnSinglePage: false,
          onChange: setCurrent,
        }}
      ></Table>
      <Modal
        title={`${modalDetail ? '编辑' : '添加'}文章`}
        visible={showModal}
        onOk={submitNews}
        width={600}
        forceRender
        confirmLoading={updateOrAddNewsLoading}
        onCancel={() => {
          setModalDetail(null);
          setShowModal(false);
        }}
      >
        <Form
          name='Form'
          form={form}
          labelAlign='right'
          wrapperCol={{ span: 21 }}
          labelCol={{ span: 3 }}
          initialValues={formInitialData}
        >
          <Form.Item
            label='标题'
            name='title'
            rules={[{ required: true, message: '请输入文章标题!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label='链接'
            name='url'
            rules={[
              { type: 'url', required: true, message: '请输入文章链接!' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
