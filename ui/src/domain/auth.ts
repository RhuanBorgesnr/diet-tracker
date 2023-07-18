export type IAuthState = {
  handleLogin: (username: string, password: string) => void;
  handleLogout: () => void;
};
