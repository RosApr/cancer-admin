import React, { useCallback, useMemo } from 'react';
import { Button, Input } from 'antd';
import { fetchCancerDetailApi } from '@/api/cancer';
import { useFetchDataOnMount, useNavigate } from '@/utils/requestHook';
import DetailItem from '@/components/detailItem';
import './index.scss';

const { TextArea } = Input;
const textareaConfig = { minRows: 4 };

export default function CancerView() {
  const { params, history } = useNavigate();

  const fetchCancerCallback = useCallback(() => {
    return fetchCancerDetailApi(params.cancer_id);
  }, [params]);

  const {
    response: fetchCancerResponse,
    error: fetchCancerError,
  } = useFetchDataOnMount(fetchCancerCallback);

  const responseMemo = useMemo(() => {
    if (fetchCancerError.status === 0 && fetchCancerResponse) {
      return fetchCancerResponse;
    }
    return null;
  }, [fetchCancerError, fetchCancerResponse]);

  const goBack = () => {
    return history.push('/app/cancer/index');
  };
  return (
    <div className='cancer-detail-page'>
      {responseMemo && (
        <div>
          <DetailItem label='id'>{responseMemo.id}</DetailItem>
          <DetailItem label='名称'>{responseMemo.name}</DetailItem>
          <DetailItem label='配置'>
            <TextArea
              disabled
              autoSize={textareaConfig}
              bordered
              value={JSON.stringify(responseMemo.cancer_template, null, 2)}
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
