
import { NextResponse } from "next/server";
import NextAuth from "next-auth"
import authConfig from "./app/api/auth/[...nextauth]/auth.config";
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "./routeStrategy";
 



export const { auth} = NextAuth(authConfig)


// Middleware function
export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
  
    // Debug logging (remove in production)
    console.log("[Middleware] Path:", nextUrl.pathname);
    console.log("[Middleware] IsLoggedIn:", isLoggedIn);
  
    // Route checks
    const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  
    // 1. Allow API authentication routes
    if (isAPIAuthRoute) {
      return NextResponse.next();
    }
  
    // 2. Prevent authenticated users from accessing auth routes
    if (isAuthRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return NextResponse.next();
    }
  
    // 3. Protect private routes
    if (!isLoggedIn && !isPublicRoute) {
      // Store the attempted URL to redirect back after login
      const returnTo = encodeURIComponent(nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/sign-in`, nextUrl)
      );
    }
  
    return NextResponse.next();
  });
  
  // Matcher configuration
  export const config = {
    matcher: [
      /*
       * Match all request paths except:
       * 1. _next/static (static files)
       * 2. _next/image (image optimization files)
       * 3. favicon.ico (favicon file)
       * 4. public folder
       * 5. public files with extensions
       */
      '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$).*)',
      '/api/:path*'
    ]
  };
  


//export const runtime = "experimental-edge"