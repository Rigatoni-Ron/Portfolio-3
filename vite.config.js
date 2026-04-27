import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import url from 'node:url';

const buildsDir = path.resolve(__dirname, '..');

// Map URL prefixes -> sibling project folders inside Builds/.
// Iframes hit /projects/<slug>/... and we serve files from disk.
const projectMounts = {
  '/projects/crypto-glass-widget': path.join(buildsDir, 'Crypto-glass-widget'),
  '/projects/shape-animator': path.join(buildsDir, '3D-shape-animator'),
  '/projects/trip-globe': path.join(buildsDir, 'Plan your trip globe'),
  '/projects/animated-menu': path.join(buildsDir, 'animated-menu'),
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.wasm': 'application/wasm',
};

function projectsServer() {
  return {
    name: 'serve-sibling-projects',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const reqUrl = url.parse(req.url ?? '');
        const pathname = decodeURIComponent(reqUrl.pathname ?? '');
        const mount = Object.entries(projectMounts).find(([prefix]) =>
          pathname === prefix || pathname.startsWith(prefix + '/')
        );
        if (!mount) return next();
        const [prefix, dir] = mount;
        let rel = pathname.slice(prefix.length) || '/';
        if (rel.endsWith('/')) rel += 'index.html';
        const filePath = path.join(dir, rel);
        if (!filePath.startsWith(dir)) {
          res.statusCode = 403;
          return res.end('forbidden');
        }
        fs.stat(filePath, (err, stat) => {
          if (err || !stat.isFile()) return next();
          const ext = path.extname(filePath).toLowerCase();
          res.setHeader('Content-Type', mimeTypes[ext] ?? 'application/octet-stream');
          fs.createReadStream(filePath).pipe(res);
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), projectsServer()],
});
