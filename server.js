#!/usr/bin/env node
'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.usdz': 'model/vnd.usd+zip',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.json': 'application/json',
};

const PORT = 3000;
const ROOT = __dirname;

http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/game.html';

  const filePath = path.normalize(path.join(ROOT, urlPath));

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + urlPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const ct  = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': ct,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('Night Drive server → http://localhost:' + PORT);
  console.log('Open that URL in your browser to play.');
});
