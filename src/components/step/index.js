import React, { useState } from 'react';
import { Steps } from 'antd';

import './index.scss';
const { Step } = Steps;
const steps = [
  {
    title: '基本信息',
  },
  {
    title: '医生履历',
  },
];
export default function StepComponent({ defaultCurrent = 0 }) {
  const [current] = useState(defaultCurrent);
  return (
    <Steps
      current={current}
      className='step-container'
      labelPlacement='vertical'
    >
      {steps.map(item => (
        <Step key={item.title} {...item} />
      ))}
    </Steps>
  );
}
