import React, { Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import ProgressComp from './components/progressComponent';
import ResetPageScrollComp from './components/resetPageScrollBarComponent';
import Page from '@/page';

import './App.css';

const App = () => (
  <ConfigProvider locale={zhCN}>
      <Router basename='/'>
        <ResetPageScrollComp />
        <Suspense fallback={<ProgressComp />}>
          <Page />
        </Suspense>
      </Router>
  </ConfigProvider>
);

export default App;
