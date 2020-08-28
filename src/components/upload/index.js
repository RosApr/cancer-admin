import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getTokenFromCookie } from '@/utils/cookie';
import './index.scss';

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('上传头像图片只能是 JPG/PNG 格式!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('上传头像图片大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

export default function UploadComponent({ imgList = [], onChange }) {
  const [isUpLoadingImg, setIsUpLoadingImg] = useState(false);
  const [localImgList, setLocalImgList] = useState(imgList);
  // update
  useEffect(() => {
    setLocalImgList(imgList);
  }, [imgList]);

  const handleChange = ({ file }) => {
    if (file.status === 'uploading') {
      onChange(file);
      setIsUpLoadingImg(true);
    }
    if (file.status === 'done') {
      setIsUpLoadingImg(false);
      onChange({
        ...file,
        ...(file['response'] ? { url: file['response'].data.url } : {}),
      });
    }
    setLocalImgList([file]);
  };
  const uploadButton = (
    <div>
      {isUpLoadingImg ? <LoadingOutlined /> : <PlusOutlined />}
      <div className='ant-upload-text'>上传</div>
    </div>
  );
  return (
    <Upload
      name='file'
      listType='picture-card'
      fileList={localImgList}
      className='avatar-uploader'
      showUploadList={false}
      action={`/admin/images?X-Token=${getTokenFromCookie()}`}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {localImgList.length > 0 && localImgList[0]['status'] === 'done' ? (
        <img
          src={localImgList[0]['url']}
          alt='avatar'
          style={{ width: '100%' }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
