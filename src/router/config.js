import { lazy } from 'react';
import {
  SolutionOutlined,
  HomeOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  BugOutlined,
} from '@ant-design/icons';
import { ROLE_USER, ROLE_ADMIN, ROLE_ANONYMOUS } from '@/utils/consts.js';

export const routeMap = [
  // 列表
  {
    path: '/app/project/index',
    main: lazy(() => import('@/pages/project/index/index')),
    role: [ROLE_USER],
    state: { meta: '项目管理' },
    isInMenu: !!1,
    menuIcon: HomeOutlined,
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
    menuIcon: HomeOutlined,
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
  // // doctor
  // {
  //   path: '/app/doctor/index',
  //   main: lazy(() => import('@/pages/doctor/index/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '医生管理' },
  //   isInMenu: !!1,
  //   menuIcon: SolutionOutlined,
  // },
  // {
  //   path: '/app/doctor/basic/:id?',
  //   main: lazy(() => import('@/pages/doctor/basic/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '医生编辑' },
  //   isInMenu: !1,
  // },
  // // {
  // //   path: '/app/doctor/form/:id?',
  // //   main: lazy(() => import('@/pages/doctor/form/index')),
  // //   role: [ROLE_USER, ROLE_ADMIN],
  // //   state: { meta: '医生编辑' },
  // //   isInMenu: !1,
  // // },
  // {
  //   path: '/app/doctor/resume/:id?',
  //   main: lazy(() => import('@/pages/doctor/resume/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '医生简历' },
  //   isInMenu: !1,
  // },
  // // {
  // //   path: '/app/doctor/schedule/:id?',
  // //   main: lazy(() => import('@/pages/doctor/schedule/index')),
  // //   role: [ROLE_USER, ROLE_ADMIN],
  // //   state: { meta: '医生排期' },
  // //   isInMenu: !1,
  // // },
  // // {
  // //   path: '/app/doctor/steps',
  // //   main: lazy(() => import('@/pages/doctor/steps/index')),
  // //   role: [ROLE_USER],
  // //   state: { meta: '医生编辑' },
  // //   isInMenu: !1,
  // // },
  // // office
  // {
  //   path: '/app/offices/index',
  //   main: lazy(() => import('@/pages/office/index/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '门店管理' },
  //   isInMenu: !!1,
  //   menuIcon: ShopOutlined,
  // },
  // {
  //   path: '/app/offices/edit/:id',
  //   main: lazy(() => import('@/pages/office/edit/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '门店编辑' },
  //   isInMenu: !1,
  // },
  // // user
  // // {
  // //   path: '/app/user/form',
  // //   main: lazy(() => import('@/pages/user/form/index')),
  // //   role: [ROLE_USER, ROLE_ADMIN],
  // //   state: { meta: '账户编辑' },
  // //   isInMenu: !1,
  // // },
  // {
  //   path: '/app/user/index',
  //   main: lazy(() => import('@/pages/user/index/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '账户管理' },
  //   isInMenu: !1,
  // },
  // {
  //   path: '/app/services/index',
  //   main: lazy(() => import('@/pages/services/index/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '服务配置' },
  //   isInMenu: !!1,
  //   menuIcon: UnorderedListOutlined,
  // },
  // {
  //   path: '/app/services/edit/:id',
  //   main: lazy(() => import('@/pages/services/edit/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '服务配置编辑' },
  //   isInMenu: !1,
  // },
  // {
  //   path: '/app/services/edit/:id',
  //   main: lazy(() => import('@/pages/services/edit/index')),
  //   role: [ROLE_USER],
  //   state: { meta: '服务配置编辑' },
  //   isInMenu: !1,
  // },
  // {
  //   path: '/app/log',
  //   main: lazy(() => import('@/pages/log/index')),
  //   role: [ROLE_ADMIN],
  //   state: { meta: '错误日志' },
  //   isInMenu: !!1,
  //   menuIcon: BugOutlined,
  // },
];
