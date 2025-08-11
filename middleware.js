import nextIntlMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  nextIntlMiddleware({ locales: ['en', 'th'], defaultLocale: 'en' }),
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const url = req.nextUrl.pathname;
        if (url.startsWith('/admin') || url.startsWith('/api/admin')) {
          return token?.role === 'admin'; // เฉพาะ admin
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
