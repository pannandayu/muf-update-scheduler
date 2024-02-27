export type LoginDataReturn = {
  message: string;
  username?: string;
  role?: string;
  token?: string;
};

export type LoginDataInput = {
  username: string;
  password: string;
};
