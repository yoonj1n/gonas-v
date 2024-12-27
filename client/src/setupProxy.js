const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://10.27.1.140:3001",
      changeOrigin: true,
    })
  );
};