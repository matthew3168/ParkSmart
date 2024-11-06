export const constructLogoutUrl = () => {
    const COGNITO_DOMAIN = 'https://parksmart.auth.us-east-1.amazoncognito.com';
    const CLIENT_ID = '7rd8b4akmjtonbjuh7a2dag4pm';
    const LOGOUT_URI = 'https://parksmart-alb-1934178389.us-east-1.elb.amazonaws.com';
  
    // Construct the full logout URL with all necessary parameters
    const logoutUrl = new URL(`${COGNITO_DOMAIN}/logout`);
    
    // Add required parameters
    logoutUrl.searchParams.append('client_id', CLIENT_ID);
    logoutUrl.searchParams.append('logout_uri', LOGOUT_URI);
    // Add response_type to trigger a new login flow after logout
    logoutUrl.searchParams.append('response_type', 'code');
    // Add redirect_uri to send them back to login after logout
    logoutUrl.searchParams.append('redirect_uri', `${LOGOUT_URI}/login`);
  
    return logoutUrl.toString();
  };