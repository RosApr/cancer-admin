const jsonServer = require('json-server');
const routerDb = require('./router.js');
const routerMiddleware = jsonServer.router(routerDb);
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);

server.use((_, res, next) => {
  setTimeout(next, 500);
});
// 医生列表
server.get('/doctor/list', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('doctor').value().doctor_list),
);

// 同步医生
server.post('/doctor/sync', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('doctor').value().sync_docotr),
);

//
server.post('/api/v1/providers', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('doctor').value().doctor_detail),
);

// 上传 图片
server.post('/images', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('doctor').value().upload_image),
);

// 医生详情
server.get('/doctor', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('doctor').value().doctor_detail),
);

// 更新 医生详情
server.post('/doctor', (_, res) =>
  res.status(200).json(
    routerMiddleware.db
      .get('doctor')
      .value()
      .doctor_update(),
  ),
);

// 删除医生
server.delete('/doctor', (_, res) =>
  res.status(200).json(
    routerMiddleware.db
      .get('doctor')
      .value()
      .doctor_del(),
  ),
);

// 医生简历
server.get('/doctor/resume', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('doctor').value().doctor_resume),
);

// 更新医生简历
server.post('/doctor/resume', (_, res) =>
  res
    .status(200)
    .json(routerMiddleware.db.get('doctor').value().update_doctor_resume),
);

// 医生排期表
server.get('/doctor/schedule', (_, res) =>
  res
    .status(200)
    .json(routerMiddleware.db.get('doctor').value().doctor_schedule),
);

// 更新 医生排期表
server.post('/doctor/schedule', (_, res) =>
  res
    .status(200)
    .json(routerMiddleware.db.get('doctor').value().update_doctor_schedule),
);

// 每日一条
server.get('/dashborad/fetch', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('office').value()),
);

// 门店同步
server.get('/office/sync', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('office').value().office_update),
);

// 门店列表
server.get('/office', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('office').value().office_list),
);

// 门店详情
server.get('/office/:id', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('office').value().office_detail),
);

// 更新 门店
server.post('/office', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('office').value().office_update),
);

// 患者列表
server.get('/patient/list', (_, res) =>
  res
    .status(200)
    .json(routerMiddleware.db.get('patient_list').value().patient_list),
);

// 服务列表
server.get('/cate', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('service').value().service_list),
);

// 服务详情
server.get('/cate/:id', (_, res) =>
  res
    .status(200)
    .json(routerMiddleware.db.get('service').value().service_detail),
);

// 更新 服务
server.post('/cate', (_, res) =>
  res
    .status(200)
    .json(routerMiddleware.db.get('service').value().service_update),
);

// 登录
server.post('/user/login', (req, res) =>
  res.status(200).json(
    routerMiddleware.db
      .get('user')
      .value()
      .login(req.params),
  ),
);

// 用户
server.get('/user', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('user').value().user_detail),
);

// 登出
server.post('/user/logout', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('user').value().logout),
);

// 用户列表
server.get('/user/list', (_, res) =>
  res.status(200).json(routerMiddleware.db.get('user').value().user_list),
);

// 更新用户
server.post('/user', (req, res) =>
  res.status(200).json(
    routerMiddleware.db
      .get('user')
      .value()
      .update_user(req.params),
  ),
);

server.use(routerMiddleware);

server.listen(9001, () => {
  console.log(`mock server start at 9001`);
});
