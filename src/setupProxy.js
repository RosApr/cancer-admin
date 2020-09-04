const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://clinic.jschgcp.cn',
      changeOrigin: true,
    })
  );
  app.use(
    '/mock',
    createProxyMiddleware({
      // mock api
      target: 'http://localhost:' + process.env.REACT_APP__MOCK_SERVER_PORT,
      pathRewrite: { '^/mock': '' },
      // online api
      // target: 'http://vadmtest.eyangmedia.com/',
      // changeOrigin: true,
    })
  );
};
