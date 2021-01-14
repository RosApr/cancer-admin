import React from 'react';
import { Tag } from 'antd';

export const SPECIAL_REQUEST_URL = '/api';

export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_ANONYMOUS = 'ROLE_ANONYMOUS';

export const ACCOUNT_USER = 'adm';
export const ACCOUNT_ADMIN = 'root';

export const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
};

export const FORM_STATUS = {
  add: false,
  update: true,
};

export const PROCESS_CONFIG = [
  {
    key: '正在进行',
    value: 0,
  },
  {
    key: '已结束',
    value: 1,
  },
];

export const USER_ROLE_CONFIG = [
  {
    value: 4,
    text: '管理员',
  },
  {
    value: 2,
    text: '医生',
  },
  {
    value: 5,
    text: '院长',
  },
];

export const PATIENT_ACCEPT_CONDITION = [
  {
    value: true,
    text: '已入组',
  },
  {
    value: false,
    text: '未入组',
  },
];

export const PATIENT_ACCEPT_TAG_CONFIG = {
  true: <Tag color='success'>已入组</Tag>,
  false: <Tag color='error'>未入组</Tag>,
};

export const WECHAT_REGISTER_TAG_CONFIG = {
  true: <Tag color='success'>已绑定</Tag>,
  false: <Tag color='error'>未绑定</Tag>,
};

export const ROLE_TAG_CONFIG = {
  4: <Tag color='blue'>管理员</Tag>,
  2: <Tag color='green'>医生</Tag>,
  5: <Tag color='purple'>院长</Tag>,
};

export const projectfilterFormConfig = [
  {
    key: 'cancer_id',
    list: [],
    defaultValue: 0,
    placeholder: '请选择癌症',
    isFullMatch: true,
    value: 0,
  },
  {
    key: 'description',
    defaultValue: '',
    placeholder: '请输入项目描述',
    isFullMatch: false,
    value: '',
  },
  {
    key: 'exclusion',
    defaultValue: '',
    placeholder: '请输入项目排除标准',
    isFullMatch: false,
    value: '',
  },
  {
    key: 'acceptance',
    defaultValue: '',
    placeholder: '请输入项目入组标准',
    isFullMatch: false,
    value: '',
  },
];

export const fetchProjectDefaultParams = projectfilterFormConfig.reduce(
  (result, current) => {
    result[current['key']] = current.value;
    return result;
  },
  {}
);
