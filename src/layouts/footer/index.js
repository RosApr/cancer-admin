import React from 'react';
import { Layout } from 'antd';
import './index.scss';
const { Footer } = Layout;

export default function CopyRight() {
  return (
    <Footer className='copyright'>
      Copyright© 2019-2020 EyangMedia All Right Reserved.
      易扬信息技术（北京）有限公司 版权所有 - 京ICP备16027532号-1
    </Footer>
  );
}
