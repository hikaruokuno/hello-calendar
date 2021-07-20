import React, { FC, useContext } from "react";
import firebase from "firebase/app";
// import { FirebaseContext } from 'contexts';
// import { StyledFirebaseAuth } from 'react-firebaseui';
import Config from "apiGoogleconfig";
// import { useNavigate } from 'react-router';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from "react-google-login";
import { useNavigate } from "react-router";
import { FirebaseContext } from "contexts";

const initClient = () => {
  gapi.client
    .init(Config)
    .then(() => {
      console.log("signIn", gapi.auth2.getAuthInstance().isSignedIn.get());

      // Listen for sign-in state changes.
      // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // Handle the initial sign-in state.
      // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      // if (onLoadCallback) {
      //   onLoadCallback();
      // }
    })
    .catch((e: any) => {
      console.log(e);
    });
};

const handleClientLoad = () => {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  document.body.appendChild(script);
  script.onload = (): void => {
    gapi.load("client:auth2", initClient);
  };
};
handleClientLoad();

const Signin: FC = () => {
  // const { auth } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const { setCredential } = useContext(FirebaseContext);
  // const { pathname } = useLocation();
  // const uiConfig: firebaseui.auth.Config = {
  //   signInFlow: 'redirect',
  //   signInOptions: [
  //     {
  //       provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //       scopes: ['https://www.googleapis.com/auth/calendar.events'],
  //     },
  //   ],
  //   callbacks: {
  //     signInSuccessWithAuthResult: (authResult, redirectUrl) => {
  //       const dest = redirectUrl || '/';
  //       navigate(dest, { replace: true });

  //       return false;
  //     },
  //   },
  // };

  const implementsLoginRes = (response: any): response is GoogleLoginResponse =>
    response !== null && typeof response === "object";
  const responseGoogle = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (implementsLoginRes(response)) {
      const credential = firebase.auth.GoogleAuthProvider.credential(
        response.tokenId
      );
      await firebase
        .auth()
        .signInWithCredential(credential)
        .then(() => {
          console.log(credential);
          setCredential(credential);
        });
    }
  };

  const logout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("ログアウトしました");
      });
    navigate("/", { replace: true });

    // if (gapi) {
    //   await gapi.auth2.getAuthInstance().signOut();
    // } else {
    //   console.log('Error: this.gapi not loaded');
    // }
  };

  return (
    <>
      <GoogleLogin
        clientId={Config.clientId}
        buttonText="Googleアカウントでログイン"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
        // redirectUri={pathname}
      />
      <GoogleLogout
        clientId={Config.clientId}
        buttonText="ログアウト"
        onLogoutSuccess={logout}
      />
    </>
  );
};

export default Signin;
