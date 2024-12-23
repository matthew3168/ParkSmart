import crypto from 'crypto';

const CLIENT_ID = '36rvfehpaasebugneghn6qhmko';
const CLIENT_SECRET = 'vm4fi3970j2vihi2if8a9l05reufg1tl5p82ougc7ge25p8lt1o';
const COGNITO_URL = 'https://cognito-idp.us-east-1.amazonaws.com/';
const USER_POOL_ID = 'us-east-1_fHl7actWa';

const generateSecretHash = (username: string): string => {
  const message = username + CLIENT_ID;
  return crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(message)
    .digest('base64');
};

export const auth = {
  signUp: async (username: string, password: string, email: string): Promise<any> => {
    try {
      const secretHash = generateSecretHash(username);
      const signUpData = {
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        SecretHash: secretHash,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          }
        ]
      };

      console.log('Attempting to sign up user:', username);

      const signUpResponse = await fetch(COGNITO_URL, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
          'Content-Type': 'application/x-amz-json-1.1'
        },
        body: JSON.stringify(signUpData)
      });

      const signUpResult = await signUpResponse.json();
      
      if (!signUpResponse.ok) {
        throw new Error(signUpResult.message || signUpResult.__type || 'Registration failed');
      }

      return signUpResult;

    } catch (error: any) {
      console.error('Registration process error:', error);
      if (error.message.includes('UsernameExistsException')) {
        throw new Error('This username is already taken. Please try another one.');
      } else if (error.message.includes('InvalidPasswordException')) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.');
      } else {
        throw new Error(error.message || 'Failed to register. Please try again.');
      }
    }
  },

  confirmSignUp: async (username: string, code: string): Promise<any> => {
    try {
      const secretHash = generateSecretHash(username);

      const reqData = {
        ClientId: CLIENT_ID,
        Username: username,
        ConfirmationCode: code,
        SecretHash: secretHash
      };

      const response = await fetch(COGNITO_URL, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
          'Content-Type': 'application/x-amz-json-1.1'
        },
        body: JSON.stringify(reqData)
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || jsonResponse.__type || 'Failed to confirm registration');
      }

      return jsonResponse;
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      throw new Error(error.message || 'Failed to confirm registration');
    }
  },

  resendConfirmationCode: async (username: string): Promise<any> => {
    try {
      const secretHash = generateSecretHash(username);

      const reqData = {
        ClientId: CLIENT_ID,
        Username: username,
        SecretHash: secretHash
      };

      const response = await fetch(COGNITO_URL, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.ResendConfirmationCode',
          'Content-Type': 'application/x-amz-json-1.1'
        },
        body: JSON.stringify(reqData)
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || jsonResponse.__type || 'Failed to resend code');
      }

      return jsonResponse;
    } catch (error: any) {
      console.error('Resend confirmation code error:', error);
      throw new Error(error.message || 'Failed to resend confirmation code');
    }
  },

  signIn: async (username: string, password: string): Promise<any> => {
    try {
      const secretHash = generateSecretHash(username);

      const reqData = {
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: secretHash
        },
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID
      };

      const response = await fetch(COGNITO_URL, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
          'Content-Type': 'application/x-amz-json-1.1'
        },
        body: JSON.stringify(reqData)
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || jsonResponse.__type || 'Authentication failed');
      }

      if (jsonResponse.AuthenticationResult) {
        localStorage.setItem('cognito-token', jsonResponse.AuthenticationResult.IdToken);
        localStorage.setItem('cognito-access-token', jsonResponse.AuthenticationResult.AccessToken);
        localStorage.setItem('cognito-refresh-token', jsonResponse.AuthenticationResult.RefreshToken);
        localStorage.setItem('cognito-username', username);
        return jsonResponse.AuthenticationResult;
      } else {
        throw new Error('No authentication result returned');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message.includes('UserNotConfirmedException')) {
        throw new Error('Please confirm your registration before signing in.');
      }
      throw new Error(error.message || 'Failed to authenticate');
    }
  },

  refreshSession: async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('cognito-refresh-token');
      const username = localStorage.getItem('cognito-username');

      if (!refreshToken || !username) {
        return false;
      }

      const secretHash = generateSecretHash(username);

      const reqData = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: secretHash
        }
      };

      const response = await fetch(COGNITO_URL, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
          'Content-Type': 'application/x-amz-json-1.1'
        },
        body: JSON.stringify(reqData)
      });

      const jsonResponse = await response.json();

      if (response.ok && jsonResponse.AuthenticationResult) {
        localStorage.setItem('cognito-token', jsonResponse.AuthenticationResult.IdToken);
        localStorage.setItem('cognito-access-token', jsonResponse.AuthenticationResult.AccessToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      const accessToken = localStorage.getItem('cognito-access-token');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(COGNITO_URL, {
        method: 'POST',
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser',
          'Content-Type': 'application/x-amz-json-1.1'
        },
        body: JSON.stringify({
          AccessToken: accessToken
        })
      });

      if (!response.ok) {
        // Try to refresh the session if the current token is invalid
        const refreshSuccess = await auth.refreshSession();
        if (!refreshSuccess) {
          throw new Error('Failed to refresh session');
        }
        // Retry the getCurrentUser call with the new token
        return auth.getCurrentUser();
      }

      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('cognito-token');
      if (!token) return false;

      // Try to get current user, which will refresh the session if needed
      await auth.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  signOut: () => {
    localStorage.removeItem('cognito-token');
    localStorage.removeItem('cognito-access-token');
    localStorage.removeItem('cognito-refresh-token');
    localStorage.removeItem('cognito-username');
  },
  
  decodeToken: (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  isAdmin: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('cognito-token');
      if (!token) return false;

      const decodedToken = auth.decodeToken(token);
      console.log('Decoded token:', decodedToken); // Debug log

      // Check 'cognito:groups' claim in the token
      const groups = decodedToken['cognito:groups'] || [];
      console.log('User groups:', groups); // Debug log

      return groups.includes('Administrators');
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  adminSignIn: async (username: string, password: string): Promise<any> => {
    try {
      // First perform normal sign in
      const result = await auth.signIn(username, password);
      
      // Check admin status using the token
      const isAdminUser = await auth.isAdmin();
      
      if (!isAdminUser) {
        auth.signOut();
        throw new Error('Unauthorized: Admin access required');
      }
      
      return result;
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      throw error;
    }
  }
};