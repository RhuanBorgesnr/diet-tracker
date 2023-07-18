import React from 'react';
import { useContext,  } from "react";
import styled from "styled-components";
import { Button, TextField } from "@material-ui/core";
import { AuthContext } from "../states/AuthState";
import { Controller, useForm } from "react-hook-form";

type LoginPageProps = {
  className?: string;
};

const LoginPage = ({ className }: LoginPageProps) => {
  const { handleLogin } = useContext(AuthContext);

  const { control, handleSubmit: handleFormSubmit } = useForm({});

  const handleSubmit = async (values: any) => {
    const { username, password } = values;

    handleLogin(username, password);
  };

  return (
    <div className={className}>
      <form onSubmit={handleFormSubmit(handleSubmit)}>
        <Controller
          name="username"
          control={control}
          render={({ field }: { field: any }) => (
            <TextField label="Usuário" variant="standard" {...field} />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }: { field: any }) => (
            <TextField
              label="Senha"
              type="password"
              variant="standard"
              {...field}
            />
          )}
        />
        <StyledButton type="submit" variant="contained">
          Enviar
        </StyledButton>
      </form>
    </div>
  );
};

const StyledButton = styled(Button)`
  background-color: #4caf50;
  color: #fff;
  margin-top: 20px;
  &:hover {
    background-color: #45a049;
  }
`;

export default styled(LoginPage)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h1 {
      margin-bottom: 20px;
    }

    .MuiTextField-root {
      margin-bottom: 10px;
      width: 300px;
    }
  }
`;
