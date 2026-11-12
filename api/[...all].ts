import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/app.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Recover original URL if rewritten by Vercel
  const forwardedUri = req.headers['x-forwarded-uri'] as string;
  const matchedPath = req.headers['x-matched-path'] as string;
  const nowMatches = req.headers['x-now-route-matches'] as string;

  if (forwardedUri && forwardedUri.startsWith('/api')) {
    req.url = forwardedUri;
  } else if (matchedPath && matchedPath.startsWith('/api') && matchedPath !== '/api') {
    req.url = matchedPath;
  } else if (nowMatches) {
    const match = nowMatches.match(/1=([^&]+)/);
    if (match && match[1]) {
      req.url = '/api/' + decodeURIComponent(match[1]);
    }
  }

  if (req.query?.all) {
    const slug = Array.isArray(req.query.all) ? req.query.all.join('/') : req.query.all;
    if (slug) {
      req.url = '/api/' + slug;
    }
  }

  return app(req, res);
}
