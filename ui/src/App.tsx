import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import AuthState from "./states/AuthState";
// import UserCreatePage from "./pages/UserCreatePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/routes/PrivateRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import QuestionForm from "./pages/QuestionsForm";
import DietScreen from "./pages/DietScreenPage";
import ChartPage from "./pages/ChartPage";
import DailyMacrosPage from "./pages/ProteinsChart";



function App() {
  return (
    <>
      <BrowserRouter>
        <AuthState>
          <Switch>
            <Route component={LoginPage} path="/login" />
            <Route component={DailyMacrosPage} path="/chart-protein" />
            <PrivateRoute component={QuestionForm} path="/questions" />
            {/* <Route component={ChartProgressPage} path="/graph" /> */}
            <PrivateRoute component={HomePage} path="/" exact />
            <PrivateRoute component={DietScreen} path="/diet-screen" exact />
            <PrivateRoute component={ChartPage} path="/graph" exact />

            <Route component={NotFoundPage} path="/not-found" exact />
            {/* <Route component={NotFoundPage} path="/not-found" exact /> */}
            {/* <PrivateRoute
              component={UserCreatePage}
              path="/usuarios/new"
              exact
            /> */}
            <Redirect to="/not-found" />
          </Switch>
        </AuthState>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;