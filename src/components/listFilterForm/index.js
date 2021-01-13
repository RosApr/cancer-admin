import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import './index.scss';

const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ListFilterForm = ({ config = [], onSearch = () => {} }) => {
  const [initFormValue, setInitFormValue] = useState(null);
  // make form initial data
  useEffect(() => {
    if (config.length === 0) return;
    const formInitialData = {};
    config.forEach(({ key, defaultValue, list }) => {
      formInitialData[key] = defaultValue;
    });
    setInitFormValue(formInitialData);
  }, [config]);

  return (
    initFormValue && (
      <Form
        className='table-filter-form'
        layout='inline'
        initialValues={initFormValue}
        onFinish={onSearch}
        name='filterConfigForm'
      >
        {config.map(
          ({ key, list, type, placeholder, defaultValue, ...config }) => (
            <Item className='' name={key} key={key}>
              {list ? (
                <Select
                  className='custom-select'
                  placeholder={placeholder}
                  showSearch
                  dropdownStyle={{ minWidth: 160 }}
                >
                  {list.map(({ id, name }) => (
                    <Option value={id} key={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              ) : type === 'rangePicker' ? (
                <RangePicker {...config} />
              ) : (
                <Input placeholder={placeholder} />
              )}
            </Item>
          )
        )}
        <Item>
          <Button type='primary' htmlType='submit'>
            搜索
          </Button>
        </Item>
      </Form>
    )
  );
};

export default ListFilterForm;
