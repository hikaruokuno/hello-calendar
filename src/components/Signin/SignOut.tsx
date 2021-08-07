import React from "react";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router";
import { remove } from "services/hello-calendar/CookieServise";

const SignOut = () => {
  const navigate = useNavigate();
  const logout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(async () => {
        if (gapi) {
          localStorage.clear();
          remove("accessTokenKey");
          remove("refreshTokenKey");
          await gapi.auth2.getAuthInstance().signOut();
        } else {
          console.log("Error: this.gapi not loaded");
        }
        navigate(0);
        navigate("/", { replace: true });
      });
  };

  return <Button onClick={() => logout()}>ログアウト</Button>;
};

export default SignOut;
