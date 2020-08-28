const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/admin',
    createProxyMiddleware({
      // mock api
      target: 'http://localhost:' + process.env.REACT_APP__MOCK_SERVER_PORT,
      pathRewrite: { '^/admin': '' },
      // online api
      // target: 'http://vadmtest.eyangmedia.com/',
      // changeOrigin: true,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.linkedcare.cn:9001',
      changeOrigin: true,
      headers: {
        Authorization:
          'bearer qE2JSWuxoUfg2CdtEbwzvZAtit9_reuoh3NYDA_LTjrABrxg3yD-wA5PoYc3D7WQkb67GcnIknma3Fz3bsCiRCsdPyaSwbJ44FKRMTCMWMxwXPwEdklxMxHji_JZOz0XsUtZyb321zoF-RnRQzDWWMBWShUWdUnwymZXm8WRsCfnUwOy-iEibUidqvV1YEE4isqdpHtmF6Y-j7CUfEvqmGEC2ZLNO8PgnEQTFfIu7aJowXtZCeGCnJIJP5MEa1YpAAv_wWrvqmhKQVDeGAqhluDUaeeR6-QAFwGE3ESu5dE',
      },
    })
  );
};
