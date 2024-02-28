interface LoginDataReturn {
  message: string;
  username?: string;
  role?: string;
  token?: string;
}

interface LoginDataInput {
  username: string;
  password: string;
}

interface SignupDataInput {
  username: string;
  password: string;
  signupKey: string;
}

export type { LoginDataReturn, LoginDataInput, SignupDataInput };
