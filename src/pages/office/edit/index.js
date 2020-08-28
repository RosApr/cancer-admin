import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, InputNumber, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { getOffice, save as saveApi } from '@/api/office';
import { UPDATE_OFFICE } from '@/redux/actionTypes/office';
import {
  useRequest,
  useFetchDataOnMount,
  useNavigate,
  useRequestResult,
} from '@/utils/requestHook';
import Upload from '@/components/upload';
import './index.scss';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
export default function OfficeEdit() {
  const dispatch = useDispatch();
  const {
    params: { id: officeId },
    history,
  } = useNavigate();
  const [{ response, error, requestData }, save] = useRequest(saveApi);
  const [imgList, setImgList] = useState([]);
  const [isUpLoadingImg, setIsUpLoadingImg] = useState(false);
  //fetch data
  const fetchApiCallback = useCallback(async () => await getOffice(officeId), [
    officeId,
  ]);
  const { response: officeForm } = useFetchDataOnMount(fetchApiCallback, null);
  useEffect(() => {
    if (officeForm) {
      setImgList([
        {
          uid: '-1',
          name: officeForm.image,
          url: officeForm.image,
          status: 'done',
        },
      ]);
    }
  }, [officeForm]);

  const handleUploadImgChange = imgFile => {
    if (imgFile.status === 'uploading') {
      setIsUpLoadingImg(true);
    } else if (imgFile.status === 'done') {
      setIsUpLoadingImg(false);
      setImgList([imgFile]);
    }
    // else if(imgFile.status === 'remove') {

    // } else if(imgFile.status === 'error') {

    // }
  };

  const handleFormSubmit = formData => {
    save({ ...officeForm, ...formData });
  };

  const goPrev = () => history.goBack();
  const goOfficeIndex = useCallback(
    requestData => {
      dispatch({
        type: UPDATE_OFFICE,
        payload: requestData,
      });
      history.push('/app/offices/index');
    },
    [history, dispatch],
  );

  // submit
  useRequestResult({
    response,
    error,
    requestData,
    cb: goOfficeIndex,
  });
  return (
    <div className='office-edit-layer'>
      {officeForm && (
        <Form
          name='officeForm'
          labelAlign='right'
          {...formItemLayout}
          onFinish={handleFormSubmit}
          initialValues={officeForm}
        >
          {imgList.length > 0 && (
            <Form.Item
              name='image'
              label='门店缩略图'
              extra='最多上传一张照片'
              rules={[{ required: true, message: '请上传一张图片' }]}
              normalize={value => {
                const isNotChange = typeof value === 'string';
                if (isNotChange) {
                  return value;
                }
                if (value['status'] === 'done') {
                  return value.response.data.url;
                }
                return '';
              }}
            >
              <Upload imgList={imgList} onChange={handleUploadImgChange} />
            </Form.Item>
          )}
          <Form.Item
            name='lat'
            label='纬度'
            rules={[{ required: true, message: '请填写门店纬度' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name='lon'
            label='经度'
            rules={[{ required: true, message: '请填写门店经度' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
            <Space size='large'>
              <Button
                type='primary'
                htmlType='submit'
                disabled={isUpLoadingImg}
              >
                提交
              </Button>
              <Button onClick={goPrev}>返回</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
