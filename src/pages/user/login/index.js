import React, { useCallback } from 'react';
import { Form, Input, Button, Row, Col, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRequest, useNavigate, useRequestResult } from '@/utils/requestHook';
import { login as loginApi } from '@/api/user';
import { setTokenToCookie, setUserRoleToCookie } from '@/utils/cookie';
import {
  ROLE_USER,
  ROLE_ADMIN,
  ACCOUNT_USER,
  ACCOUNT_ADMIN,
} from '@/utils/consts';

import './index.scss';

const layout = {
  wrapperCol: { span: 24 },
};
const { Title } = Typography;

export default function Login() {
  const { history, location } = useNavigate();
  const [loginForm] = Form.useForm();
  const [{ response, error, requestData }, login] = useRequest(loginApi);
  const loginCb = useCallback(() => {
    const { access_toke } = response;
    if (response) {
      // set token
      setTokenToCookie(access_toke);
      // set user role
      let _role = '';
      // if (username === ACCOUNT_USER) {
      _role = ROLE_USER;
      // } else if (username === ACCOUNT_ADMIN) {
      // _role = ROLE_ADMIN;
      // }
      setUserRoleToCookie(_role);
      // setUserRoleToCookie(role || _role);
      // navigate
      let nextPath = '/';
      if (location.state) {
        nextPath = location.state.from.pathname;
      }
      history.replace(nextPath);
    }
  }, [response, history, location, requestData]);

  const handleSubmit = () => {
    loginForm
      .validateFields()
      .then(async values => {
        // name field is untouched and not empty or in edit
        // and name equal edit init name
        return login(values);
      })
      .catch(error => {});
  };
  useRequestResult({ response, error, cb: loginCb });
  return (
    <Row className='login-layer' align='middle' justify='center'>
      <Col span={24}>
        <Title level={2} className='title'>
          江苏省肿瘤防治研究所
        </Title>
      </Col>
      <Col span={12} className='form-container'>
        <Form size='large' {...layout} form={loginForm} name='loginForm'>
          <Form.Item
            name='username'
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder='用户名' />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder='密码' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' block onClick={handleSubmit}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
