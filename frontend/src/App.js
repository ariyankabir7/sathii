import React, { Suspense, useEffect, useState } from "react";

// routing
import { Switch, BrowserRouter, Route } from "react-router-dom";
//redux
import { useDispatch, useSelector } from "react-redux";
//types
import { SET_ADMIN, UNSET_ADMIN } from "./store/admin/types";

import { IdleTimeoutManager } from "idle-timer-manager";

//Components
import Login from "./pages/LoginPage";

import UnlockScreenPage from "./pages/UnlockScreenPage";
import Page404 from "./pages/Page404";
import Admin from "./pages/Admin";
import AuthRouter from "./util/AuthRouter";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import axios from "axios";
import Registration from "./pages/Registration";
import UpdateCode from "./pages/UpdateCode";
import Spinner from "./pages/Spinner";

function App() {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.admin);
  const [login, setLogin] = useState(false);
  const token = localStorage.getItem("TOKEN");

  const key = localStorage.getItem("KEY");

  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        console.log("res.data", res.data);
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: SET_ADMIN, payload: token });
  }, [token, key, dispatch]);

  useEffect(() => {
    const manager = new IdleTimeoutManager({
      timeout: 1200, //20 min (in sec)
      onExpired: (time) => {
        dispatch({ type: UNSET_ADMIN });
        return (window.location.href = "/");
      },
    });

    return () => {
      manager.clear();
    }; //eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <Suspense fallback={""}>
        <BrowserRouter>
          <Switch>
            <AuthRouter
              exact
              path="/"
              component={login ? Login : Registration}
            />

            {login && <AuthRouter exact path="/code" component={UpdateCode} />}
            {login && <AuthRouter exact path="/login" component={Login} />}
            {login && (
              <AuthRouter path="/Registration" component={Registration} />
            )}
            <AuthRouter exact path="/unlock" component={UnlockScreenPage} />
            <Route exact path="/forgot" component={ForgotPassword} />
            <Route
              exact
              path="/changePassword/:id"
              component={ChangePassword}
            />
            {isAuth && <Route path="/admin" component={Admin} />}
            <Route component={Page404} />
          </Switch>
          <Spinner />
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
