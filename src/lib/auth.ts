import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: "us-east-1_odL45tRcG",
  ClientId: "7rd8b4akmjtonbjuh7a2dag4pm",
});

export const auth = {
  signIn: async (email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  },

  signOut: () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  },

  getCurrentUser: (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const user = userPool.getCurrentUser();
      if (!user) {
        reject(null);
        return;
      }

      user.getSession((err: any, session: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(user);
      });
    });
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      await auth.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};

