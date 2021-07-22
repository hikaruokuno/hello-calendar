import React from "react";
import firebase from "firebase";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router";

const SignOut = () => {
  const navigate = useNavigate();
  const logout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        navigate(0);
        navigate("/", { replace: true });

        console.log("ログアウトしました");
      });
    if (gapi) {
      await gapi.auth2.getAuthInstance().signOut();
    } else {
      console.log("Error: this.gapi not loaded");
    }
  };

  return <Button onClick={() => logout()}>ログアウト</Button>;
};

export default SignOut;
