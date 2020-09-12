import { useState, useEffect, useMemo } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { message as Message } from 'antd';
import { FORM_STATUS } from '@/utils/consts';
const initError = { status: 2, message: '' };

export const useRequestResult = ({
  response = null,
  requestData = null,
  error = { status: 0, message: '' },
  cb = null,
  messageTip = '',
}) => {
  const [isShowSuccessTip, setIsShowSuccessTip] = useState(false);
  useEffect(() => {
    if (error.status === 2) {
      setIsShowSuccessTip(false);
    }
  }, [error]);
  useEffect(() => {
    const { status, message = '' } = error;
    if (status === 1) {
      message &&
        Message.error({
          content: message,
        });
    } else if (status === 0 && !isShowSuccessTip) {
      setIsShowSuccessTip(true);
      Message.success(messageTip || '操作成功').then(() => {
        cb && cb(requestData, response);
      });
    }
  }, [error, cb, requestData, messageTip, response]);
};

// post
export const useRequest = (api = new Promise(resolve => resolve())) => {
  /**
   * @const {initError}
   * status
   * 2 => init
   * 1 => error
   * 0 => success
   */
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initError);
  const [requestData, setRequestData] = useState(null);
  const init = () => {
    setResponse(null);
    setIsLoading(false);
    setError(initError);
    setRequestData(null);
  };
  const callApi = async (...params) => {
    init();
    try {
      setIsLoading(true);
      const response = await api(...params);
      setResponse(response || null);
      setRequestData(...params);
      setError(prev => ({ ...prev, status: 0 }));
    } catch (e) {
      setError(prev => ({
        ...prev,
        status: 1,
        message: e.msg || '',
      }));
    }
    setIsLoading(false);
  };
  return [{ response, error, isLoading, requestData }, callApi];
};

// get method
export const useFetchDataOnMount = (
  fetchDataApi = new Promise(resolve => resolve()),
  initialState = null
) => {
  const initialStateMemo = useMemo(() => initialState, [initialState]);
  const [response, setResponse] = useState(initialStateMemo);
  const [error, setError] = useState(initError);
  const [isLoading, setIsLoading] = useState(false);
  // when api change reset default response error isloading
  useEffect(() => {
    setResponse(initialStateMemo);
    setError(initError);
    setIsLoading(false);
  }, [fetchDataApi, initialStateMemo]);
  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDataApi();
        setError(prev => ({ ...prev, status: 0 }));
        if (!didCancel) {
          setResponse(data || null);
        }
      } catch (e) {
        setError(prev => ({ ...prev, status: 1, message: e['data'] || '' }));
      }
      if (!didCancel) {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      if (window.cancelRequest) {
        didCancel = true;
        window.cancelRequest && window.cancelRequest();
      }
    };
  }, [fetchDataApi]);
  return { response, error, isLoading };
};

export const useInitData = (fetchDataCallback = () => {}, isUpdate) => {
  /**
   * status 2 init
   * status 1 not fetch
   * status 0 fetch data
   */
  const [{ response }, fetchData] = useRequest(fetchDataCallback);
  const [data, setData] = useState({ status: 2 });
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (isUpdate === null || isInit) return;
    if (isUpdate) {
      setIsInit(true);
      fetchData();
    } else {
      setData({ data: null, status: 1 });
    }
  }, [isUpdate, fetchData, isInit, setIsInit, setData]);

  useEffect(() => {
    if (response) {
      setData({ data: response, status: 0 });
    }
  }, [response, setData]);
  return data;
};

export const useNavigate = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  return {
    history,
    location,
    params,
  };
};

export const useReturnCurrentFormStatus = operationType => {
  const [isUpdate, setIsUpdate] = useState(null);
  useEffect(() => {
    setIsUpdate(FORM_STATUS[operationType]);
  }, [operationType]);
  return isUpdate;
};
