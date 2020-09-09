import React, { useCallback, useMemo } from 'react';
import { Tag, Button, Input } from 'antd';
import { SyncOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { fetchProjectDetailApi } from '@/api/project';
import { useFetchDataOnMount, useNavigate } from '@/utils/requestHook';
import DetailItem from '@/components/detailItem';
import './index.scss';

const { TextArea } = Input;
const textareaConfig = { minRows: 4 };

export default function ProjectView() {
  const { params, history } = useNavigate();
  const fetchProjectCallback = useCallback(() => {
    return fetchProjectDetailApi(params);
  }, [params]);
  const {
    response: fetchProjectResponse,
    error: fetchProjectError,
  } = useFetchDataOnMount(fetchProjectCallback);

  const responseMemo = useMemo(() => {
    if (fetchProjectError.status === 0 && fetchProjectResponse) {
      return fetchProjectResponse;
    }
    return null;
  }, [fetchProjectError, fetchProjectResponse]);

  const goBack = () => {
    return history.push('/app/project/index');
  };

  return (
    <div className='project-detail-page'>
      {responseMemo && (
        <div>
          <DetailItem itemWidth label='负责医生'>
            {responseMemo.person_in_charge}
            <Tag color='blue'>{responseMemo.doctor_position}</Tag>
            {responseMemo.doctor_telphone
              ? ` | ${responseMemo.doctor_telphone}`
              : ''}
            {responseMemo.doctor_visit_time &&
              ` |  门诊时间：${responseMemo.doctor_visit_time}`}
          </DetailItem>
          <DetailItem label='入组标准'>
            <div
              dangerouslySetInnerHTML={{ __html: responseMemo.acceptance }}
            />
          </DetailItem>
          <DetailItem label='项目描述'>{responseMemo.description}</DetailItem>
          <DetailItem label='排除标准'>
            <div dangerouslySetInnerHTML={{ __html: responseMemo.exclusion }} />
          </DetailItem>
          <DetailItem label='入组人数'>
            {responseMemo.accept_patients_num}人
          </DetailItem>
          <DetailItem label='申请人数'>
            {responseMemo.submit_patients_num}人
          </DetailItem>
          <DetailItem label='项目进度'>
            {responseMemo.progress === 0 ? (
              <Tag icon={<SyncOutlined spin />} color='processing'>
                正在进行
              </Tag>
            ) : (
              <Tag icon={<MinusCircleOutlined />} color='cyan'>
                已结束
              </Tag>
            )}
          </DetailItem>
          <DetailItem label='配置'>
            <TextArea
              disabled
              autoSize={textareaConfig}
              bordered
              value={JSON.stringify(responseMemo.check_criterion, null, 2)}
            />
          </DetailItem>
          <DetailItem>
            <Button type='primary' onClick={goBack}>
              返回
            </Button>
          </DetailItem>
        </div>
      )}
    </div>
  );
}
