import { lazy } from 'react';
import {
  SolutionOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { ROLE_USER, ROLE_ANONYMOUS } from '@/utils/consts.js';

export const routeMap = [
  {
    path: '/app/cancer/index',
    main: lazy(() => import('@/pages/cancer/index/index')),
    role: [ROLE_USER],
    state: { meta: '癌症管理' },
    isInMenu: !!1,
    menuIcon: SolutionOutlined,
  },
  // 详情
  {
    path: '/app/cancer/view/:cancer_id',
    main: lazy(() => import('@/pages/cancer/view/index')),
    role: [ROLE_USER],
    state: { meta: '癌症详情' },
    isInMenu: !1,
  },
  {
    path: '/app/cancer/form/:operationType/:cancer_id?',
    main: lazy(() => import('@/pages/cancer/form/index')),
    role: [ROLE_USER],
    state: { meta: '癌症更新' },
    isInMenu: !1,
  },
  // 列表
  {
    path: '/app/project/index',
    main: lazy(() => import('@/pages/project/index/index')),
    role: [ROLE_USER],
    state: { meta: '项目管理' },
    isInMenu: !!1,
    menuIcon: ShopOutlined,
  },
  // 详情
  {
    path: '/app/project/view/:cancer_id/:project_id',
    main: lazy(() => import('@/pages/project/view/index')),
    role: [ROLE_USER],
    state: { meta: '项目详情' },
    isInMenu: !1,
  },
  // 更新|新增
  {
    path: '/app/project/form/:operationType/:cancer_id?/:project_id?',
    main: lazy(() => import('@/pages/project/form/index')),
    role: [ROLE_USER],
    state: { meta: '项目更新' },
    isInMenu: !1,
  },
  // 列表
  {
    path: '/app/doctor/index',
    main: lazy(() => import('@/pages/doctor/index/index')),
    role: [ROLE_USER],
    state: { meta: '医生管理' },
    isInMenu: !!1,
    menuIcon: UnorderedListOutlined,
  },
  // 详情
  {
    path: '/app/doctor/view/:doctor_id',
    main: lazy(() => import('@/pages/doctor/view/index')),
    role: [ROLE_USER],
    state: { meta: '医生详情' },
    isInMenu: !1,
  },
  {
    path: '/app/doctor/form/:operationType/:doctor_id?',
    main: lazy(() => import('@/pages/doctor/form/index')),
    role: [ROLE_USER],
    state: { meta: '医生更新' },
    isInMenu: !1,
  },
  // 热点项目列表
  {
    path: '/app/news/index',
    main: lazy(() => import('@/pages/news/index')),
    role: [ROLE_USER],
    state: { meta: '热点文章' },
    isInMenu: !!1,
    menuIcon: OrderedListOutlined,
  },
  // 登录
  {
    path: '/login',
    main: lazy(() => import('@/pages/user/login/index')),
    role: [ROLE_ANONYMOUS],
    state: { meta: '登录' },
    isInMenu: !1,
  },
  {
    path: '/403',
    main: lazy(() => import('@/pages/403/index')),
    role: [ROLE_ANONYMOUS],
    state: { meta: '403' },
    isInMenu: !1,
  },
  {
    path: '/404',
    main: lazy(() => import('@/pages/404/index')),
    role: [ROLE_ANONYMOUS],
    state: { meta: '404' },
    isInMenu: !1,
  },
  {
    path: '/500',
    main: lazy(() => import('@/pages/500/index')),
    role: [ROLE_ANONYMOUS],
    state: { meta: '500' },
    isInMenu: !1,
  },
];
