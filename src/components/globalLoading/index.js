import React from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './index.scss';

export default function GlobalLoading() {
  const $loadingContainer = document.getElementById('loading');
  const show = () => $loadingContainer.classList.remove('hide');
  const hide = () => $loadingContainer.classList.add('hide');
  // default hide loading component
  hide();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  ReactDOM.render(
    <Spin indicator={antIcon} size='large' tip='加载中,请稍后...' />,
    $loadingContainer,
  );
  return {
    show,
    hide,
  };
}
