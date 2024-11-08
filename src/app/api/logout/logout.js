import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    constructLogoutUrl(),
    { status: 302 }
  );

  // Clear ELB Auth Session Cookies
  const cookieNames = [
    'AWSELBAuthSessionCookie-0',
    'AWSELBAuthSessionCookie-1'
  ];

  cookieNames.forEach(name => {
    // Clear the cookies with the correct attributes
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      expires: new Date(0),
      domain: request.nextUrl.hostname // This will match your domain
    });
  });

  return response;
}

function constructLogoutUrl() {
    const COGNITO_DOMAIN = 'https://parksmart.auth.us-east-1.amazoncognito.com';
    const CLIENT_ID = '7rd8b4akmjtonbjuh7a2dag4pm';
    const LOGOUT_URI = 'https://parksmart-alb-1934178389.us-east-1.elb.amazonaws.com/oauth2/idpresponse';
  
    // Construct the full logout URL with all necessary parameters
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&redirect_uri=${LOGOUT_URI}&response_type=code&scope=openid`;

  return logoutUrl;
}
