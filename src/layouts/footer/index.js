import React from 'react';
import { Layout } from 'antd';
import './index.scss';
const { Footer } = Layout;

const currentYear = new Date().getFullYear();

export default function CopyRight() {
  return (
    <Footer className='copyright'>
      `Copyright© ${currentYear}-${currentYear + 1} 江苏省肿瘤防治研究所 All
      Right Reserved. 江苏省肿瘤防治研究所(江苏省肿瘤医院) 版权所有 -
      京ICP备16027532号-1`
    </Footer>
  );
}
