import React from 'react';
import { Row, Col } from 'antd';
import './index.scss';
const TableFilterContainer = ({ left, right }) => {
  return (
    <Row
      className='table-filter-container'
      align='middle'
      justify='space-between'
    >
      <Col>{left()}</Col>
      {right && <Col>{right()}</Col>}
    </Row>
  );
};

export default TableFilterContainer;
