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

export const ProjectfilterFormConfig = [
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

export const fetchProjectDefaultParams = ProjectfilterFormConfig.reduce(
  (result, current) => {
    result[current['key']] = current.value;
    return result;
  },
  {}
);
