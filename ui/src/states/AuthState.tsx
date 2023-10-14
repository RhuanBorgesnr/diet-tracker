import React, { createContext, ReactNode, useCallback, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import { IAuthState } from "../domain/auth";
import api from "../infra/axios";

const initialState: IAuthState = {
  handleLogin: () => undefined,
  handleLogout: () => undefined,
};

export const AuthContext = createContext<IAuthState>(initialState);

type AuthStateProps = {
  children: ReactNode;
};

const AuthState = ({ children }: AuthStateProps) => {
  const history = useHistory();

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await api.post("/login/", {
          username,
          password,
        });
        const token = response.data.token;
        saveToken(token);

        const userResponse = await api.get('/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = userResponse.data;
        saveUser(user);
        if (user.is_gym_owner) {

          history.push("/dashboard");
        } else {
          history.push("/");
        }

        toast.success("Login realizado com sucesso!");
      } catch (err) {
        console.error("Erro durante o login:", err);
        toast.error("Erro durante o login. Verifique suas credenciais e tente novamente.");
      }
    },
    [history]
  );

  const handleLogout = () => {
    clearToken();
    clearUser();
    history.push("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get('/users/me/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          saveUser(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, []);

  const stateValues = {
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={stateValues}>{children}</AuthContext.Provider>
  );
};

export default AuthState;

const saveToken = async (token: string) => {
  await localStorage.setItem("token", token);
};

const saveUser = async (user: string) => {
  await localStorage.setItem('user', JSON.stringify(user))
}

const clearToken = async () => {
  await localStorage.removeItem("token");
};

const clearUser = async () => {
  await localStorage.removeItem("user");
};
