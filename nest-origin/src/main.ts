import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { appendFileSync } from 'fs';
import { join } from 'path';
import * as iconv from 'iconv-lite';
import { gunzipSync, inflateSync } from 'zlib';
import { get } from 'http';

const LOG_FILE = join(__dirname, '../log.txt');
const TARGET = 'http://120.24.232.253:50122';
const STARTUP_URL = '/api/mobile/user/sendCode?phone=13381737850';

function log(entry: string): void {
  // try {
  //   appendFileSync(LOG_FILE, entry);
  // } catch (err) {
  //   console.error('写入日志失败:', (err as Error).message);
  // }
}

/** 启动时直接请求目标地址 */
function doStartupRequest(): Promise<void> {
  return new Promise((resolve) => {
    const now = new Date().toISOString();
    const startTime = Date.now();
    const fullUrl = `${TARGET}${STARTUP_URL}`;

    get(fullUrl, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        const elapsed = Date.now() - startTime;
        let bodyBuf = Buffer.concat(chunks);
        const contentEncoding = res.headers['content-encoding'] || '';
        const contentType = res.headers['content-type'] || '';

        // 解压
        try {
          if (contentEncoding === 'gzip' || contentEncoding === 'x-gzip') {
            bodyBuf = gunzipSync(bodyBuf);
          } else if (contentEncoding === 'deflate') {
            bodyBuf = inflateSync(bodyBuf);
          }
        } catch { /* ignore */ }

        let bodyStr: string;
        const isText =
          /^text\//i.test(contentType) ||
          /\/json/i.test(contentType) ||
          /\/xml/i.test(contentType) ||
          /\/javascript/i.test(contentType) ||
          /\/x-www-form-urlencoded/i.test(contentType);

        if (isText) {
          const match = contentType.match(/charset=([^\s;]+)/i);
          const charset = (match ? match[1] : 'utf-8').toLowerCase();
          try {
            bodyStr = iconv.decode(bodyBuf, charset);
          } catch {
            bodyStr = bodyBuf.toString('utf8');
          }
          const maxLen = 2000;
          if (bodyStr.length > maxLen) {
            bodyStr = bodyStr.slice(0, maxLen) + '...(截断)';
          }
          bodyStr = `响应体: ${bodyStr}`;
        } else {
          bodyStr = `响应体: (二进制数据, 大小: ${bodyBuf.length} bytes)`;
        }

        const logEntry =
          `[${now}] 启动请求\n` +
          `方法: GET\n` +
          `路径: ${STARTUP_URL}\n` +
          `目标: ${fullUrl}\n` +
          `状态: ${res.statusCode}\n` +
          `耗时: ${elapsed}ms\n` +
          `${bodyStr}\n` +
          `----\n\n\n\n`;
        log(logEntry);

        console.info('启动请求完成:', fullUrl, res.statusCode);
        resolve();
      });
    }).on('error', (err) => {
      const elapsed = Date.now() - startTime;
      const logEntry =
        `[${now}] 启动请求\n` +
        `方法: GET\n` +
        `路径: ${STARTUP_URL}\n` +
        `目标: ${fullUrl}\n` +
        `错误: ${err.message}\n` +
        `耗时: ${elapsed}ms\n` +
        `----\n\n\n\n`;
      log(logEntry);

      console.error('启动请求失败:', fullUrl, err.message);
      resolve();
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(
    '/api',
    createProxyMiddleware({
      target: TARGET,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, _res) => {
        proxyReq.removeHeader('referer');
        proxyReq.removeHeader('Referer');
        // console.log("proxyReq",proxyReq,req, _res )
        const now = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const srcIp = req.socket.remoteAddress;
        const srcPort = req.socket.remotePort;

        // 记录转发请求的开始信息（暂存到 req 上，等响应后再统一写入）
        (req as any).__proxyStartTime = Date.now();
        (req as any).__proxyLog = `[${now}] 转发请求\n` +
          `方法: ${method}\n` +
          `路径: ${url}\n` +
          `源IP: ${srcIp}:${srcPort}\n` +
          `目标: ${TARGET}${url}\n`;
      },
      onProxyRes: (proxyRes, req, _res) => {
        // console.log("onProxyRes", proxyRes, req, _res)
        const elapsed = Date.now() - ((req as any).__proxyStartTime || Date.now());
        const statusCode = proxyRes.statusCode;
        const contentType: string = proxyRes.headers['content-type'] || '';
        const contentEncoding: string =
          proxyRes.headers['content-encoding'] || '';
        const chunks: Buffer[] = [];

        proxyRes.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        proxyRes.on('end', () => {
          let bodyBuf = Buffer.concat(chunks);

          // 先解压 gzip / deflate
          try {
            if (contentEncoding === 'gzip' || contentEncoding === 'x-gzip') {
              bodyBuf = gunzipSync(bodyBuf);
            } else if (contentEncoding === 'deflate') {
              bodyBuf = inflateSync(bodyBuf);
            }
          } catch {
            // 解压失败则保留原始 buffer，后续按二进制处理
          }

          let bodyStr: string;

          const isText =
            /^text\//i.test(contentType) ||
            /\/json/i.test(contentType) ||
            /\/xml/i.test(contentType) ||
            /\/javascript/i.test(contentType) ||
            /\/x-www-form-urlencoded/i.test(contentType);

          if (isText) {
            const match = contentType.match(/charset=([^\s;]+)/i);
            const charset = (match ? match[1] : 'utf-8').toLowerCase();
            try {
              bodyStr = iconv.decode(bodyBuf, charset);
            } catch {
              bodyStr = bodyBuf.toString('utf8');
            }
            const maxLen = 2000;
            if (bodyStr.length > maxLen) {
              bodyStr = bodyStr.slice(0, maxLen) + '...(截断)';
            }
            bodyStr = `响应体: ${bodyStr}`;
          } else {
            bodyStr = `响应体: (二进制数据, 大小: ${bodyBuf.length} bytes)`;
          }

          const logEntry =
            ((req as any).__proxyLog || '') +
            `状态: ${statusCode}\n` +
            `耗时: ${elapsed}ms\n` +
            `${bodyStr}\n` +
            `----\n\n\n\n`;
          log(logEntry);
        });
      },
      onError: (err, req, _res) => {
        // console.log("onError", err, req, _res)
        const elapsed = Date.now() - ((req as any).__proxyStartTime || Date.now());
        const logEntry =
          ((req as any).__proxyLog || '') +
          `错误: ${err.message}\n` +
          `耗时: ${elapsed}ms\n` +
          `----\n\n\n\n`;
        log(logEntry);
      },
    }),
  );

  // await doStartupRequest();

  await app.listen(3200);
}

bootstrap();

console.info('\n程序已启动', '端口为3200\n');
