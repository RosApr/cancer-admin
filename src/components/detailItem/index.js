import React from 'react';
import { Row, Col } from 'antd';
import './index.scss';

const DetailItem = ({
  labelWidth = false,
  itemWidth = false,
  label = '',
  children,
  require,
}) => {
  const span = labelWidth ? {} : { span: 7 };
  const itemSpan = itemWidth ? { flex: '1 0' } : { span: 13 };
  return (
    <Row className='detail-item' justify='flex-start' align='top'>
      {label ? (
        <>
          <Col {...span} className='label'>
            {require && <span className='icon'>*</span>}
            {label}:
          </Col>
          <Col {...itemSpan} className='value'>
            {children}
          </Col>
        </>
      ) : (
        <Col span={24} className='single-child'>
          {children}
        </Col>
      )}
    </Row>
  );
};

export default DetailItem;
