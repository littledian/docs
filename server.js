const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const compression = require('compression');
const next = require('next');
const helmet = require('helmet');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  server.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  server.use(compression());

  server.use(
    '/api/*',
    createProxyMiddleware({
      target: process.env.REMOTE_HOST || 'http://127.0.0.1:7001',
      changeOrigin: true
    })
  );

  server.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.info(`> Ready on http://localhost:3000${process.env.BASE_URL || ''}`);
  });
});
