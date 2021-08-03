import React, { FC, useContext } from "react";
import firebase from "firebase/app";
// import { FirebaseContext } from 'contexts';
// import { StyledFirebaseAuth } from 'react-firebaseui';
import Config from "apiGoogleconfig";
import { useNavigate } from "react-router";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  // GoogleLogout,
} from "react-google-login";
// import { useNavigate } from 'react-router';
import { FirebaseContext } from "contexts";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    title: {
      marginBottom: theme.spacing(1),
    },
    subTitle: {
      marginBottom: theme.spacing(2),
    },
  })
);

const refreshTokenSetup = (res: GoogleLoginResponse) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    // console.log(newAuthRes.access_token);

    localStorage.setItem("accessTokenKey", newAuthRes.access_token);

    // Setup the other timer after the first one
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setTimeout(refreshToken, refreshTiming);
};

const Signin: FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(FirebaseContext);
  const classes = useStyles();

  const implementsLoginRes = (response: any): response is GoogleLoginResponse =>
    response !== null && typeof response === "object";
  const responseGoogle = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (implementsLoginRes(response)) {
      localStorage.setItem("accessTokenKey", response.accessToken);
      refreshTokenSetup(response);
      // console.log(response.accessToken);
      // const newAuthRes = await response.reloadAuthResponse();
      // console.log('newAuthRes', newAuthRes.access_token);

      const credential = firebase.auth.GoogleAuthProvider.credential(
        response.tokenId
      );

      // localStorage.setItem('refreshTokenKey', refresh_token);
      await firebase
        .auth()
        .signInWithCredential(credential)
        .then(() => {
          // console.log(credential);
          navigate("/", { replace: true });
        });
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          {isLoggedIn ? (
            <Typography component="h1" variant="h5" className={classes.title}>
              ログイン済
            </Typography>
          ) : (
            <>
              <Typography component="h1" variant="h5" className={classes.title}>
                ログイン（テスト中）
              </Typography>
              <Typography variant="body1" className={classes.subTitle}>
                ログインすると、予定をワンタップで追加できるようになります！
              </Typography>
              <GoogleLogin
                clientId={Config.clientId}
                buttonText="Googleアカウントでログイン"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
                isSignedIn
              />
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Signin;
