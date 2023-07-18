import { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { AuthContext } from "../../states/AuthState";
import { getToken } from "../../utils/login";
import Header from "../common/Header";

type PrivateRouteProps = RouteProps;

const PrivateRoute = ({ ...props }: PrivateRouteProps) => {
  const { handleLogout } = useContext(AuthContext);

  if (getToken()) {
    return (
      <>
        <Header onLogout={handleLogout} />
        <Route {...props} />
      </>
    );
  }

  return <Redirect to="/login" />;
};

export default PrivateRoute;
