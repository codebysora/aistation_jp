// Vercel Edge Middleware — Basic Authentication gate for preview site.
// Credentials are read from Vercel environment variables:
//   BASIC_AUTH_USER / BASIC_AUTH_PASS
// Fallbacks below are only used if the env vars are missing.

export const config = {
  // Apply to every request except Vercel internals and obvious static assets
  // served at the CDN edge.
  matcher: ['/((?!_vercel|favicon\\.ico).*)'],
};

export default function middleware(request) {
  const USER = (typeof process !== 'undefined' && process.env.BASIC_AUTH_USER) || 'preview';
  const PASS = (typeof process !== 'undefined' && process.env.BASIC_AUTH_PASS) || 'aistation2026';

  const auth = request.headers.get('authorization');
  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = atob(encoded);
        const idx = decoded.indexOf(':');
        const u = idx >= 0 ? decoded.slice(0, idx) : '';
        const p = idx >= 0 ? decoded.slice(idx + 1) : '';
        if (u === USER && p === PASS) {
          // Authenticated — let the request continue.
          return;
        }
      } catch (_) {
        // fall through to 401
      }
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AIStation Preview", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=UTF-8',
    },
  });
}
