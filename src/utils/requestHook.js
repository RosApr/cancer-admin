import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useLocation, useHistory, useParams } from 'react-router-dom';
// import globalLoading from '@/components/globalLoading';

// const globalLoadingInstance = globalLoading();

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

export const useRequestResult = ({
  response,
  requestData,
  error,
  cb = () => {},
}) => {
  useEffect(() => {
    if (error.status === 1) {
      message.error({
        content: error.message,
      });
    } else if (error.status === 0) {
      message.success('操作成功').then(() => {
        cb(requestData);
      });
    }
  }, [error, cb, requestData]);
};

// sync common api
export const sync = async (
  callback = new Promise(resolve => resolve()),
  data = undefined,
) => {
  try {
    await callback(data);
    message.success({
      content: '同步更新成功',
    });
  } catch (e) {
    message.error({
      content: e.message || '同步更新失败',
    });
  }
};

// post
export const useRequest = (postDataApi = new Promise(resolve => resolve())) => {
  const initError = { status: 2, message: '' };
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initError);
  const [requestData, setRequestData] = useState(null);
  const init = () => {
    setResponse(null);
    setIsLoading(false);
    setError(initError);
    // globalLoadingInstance.hide();
  };
  const post = async params => {
    init();
    try {
      // globalLoadingInstance.show();
      setIsLoading(true);
      const response = await postDataApi(params);
      setResponse(response);
      setRequestData(params);
      setError(prev => ({ ...prev, status: 0 }));
    } catch (e) {
      setError(prev => ({ ...prev, status: true, message: e.msg }));
    }
    // globalLoadingInstance.hide();
    setIsLoading(false);
  };
  return [{ response, error, isLoading, requestData }, post];
};

// get method
export const useFetchDataOnMount = (
  fetchDataApi = new Promise(resolve => resolve()),
  initialState = null,
) => {
  const [response, setResponse] = useState(initialState);
  const [error, setError] = useState({ status: false, message: '' });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const data = await fetchDataApi();
        if (!didCancel) {
          setResponse(data);
        }
      } catch (e) {
        if (!didCancel) {
          setError(prev => ({ ...prev, status: true, message: e.msg }));
        }
      }
      if (!didCancel) {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      didCancel = true;
      window.cancelRequest();
    };
  }, [fetchDataApi]);
  return { response, error, isLoading };
};
