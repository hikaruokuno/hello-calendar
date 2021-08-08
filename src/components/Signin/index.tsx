import React, { FC, useContext } from "react";
import axios from "axios";
import firebase from "firebase/app";
import Config from "apiGoogleconfig";
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import { useNavigate } from "react-router";
import { FirebaseContext } from "contexts";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { addYears, format, setSeconds } from "date-fns";
import { set } from "services/hello-calendar/CookieServise";

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

type RestApiResponse = {
  access_token: string; // eslint-disable-line camelcase
  expires_in: number; // eslint-disable-line camelcase
  id_token: string; // eslint-disable-line camelcase
  refresh_token: string; // eslint-disable-line camelcase
  scope: string; // eslint-disable-line camelcase
};

const { clientId, clientSecret } = Config;

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
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);
      params.append("code", response.code!);
      params.append("grant_type", "authorization_code");
      params.append("redirect_uri", "https://hellocale.com");
      // params.append('redirect_uri', 'http://localhost:3000');
      await axios
        .post(`https://oauth2.googleapis.com/token`, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(async (res) => {
          const data = res.data as RestApiResponse;
          const dateOneYear = addYears(new Date(), 1);
          set("accessTokenKey", data.access_token, {
            path: "/",
            expires: dateOneYear,
          });
          set("refreshTokenKey", data.refresh_token, {
            path: "/",
            expires: dateOneYear,
          });
          // localStorage.setItem("accessTokenKey", data.access_token);
          // localStorage.setItem("refreshTokenKey", data.refresh_token);
          const timeLimit = setSeconds(new Date(), data.expires_in);
          localStorage.setItem(
            "timeLimit",
            format(timeLimit, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
          );

          const credential = firebase.auth.GoogleAuthProvider.credential(
            data.id_token
          );

          await firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
              navigate("/", { replace: true });
            });
        })
        .catch((err) => {
          console.log(err);
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
                scope={Config.scope}
                accessType="offline"
                responseType="code"
                clientId={Config.clientId}
                cookiePolicy="single_host_origin"
                prompt="consent"
                buttonText="Googleアカウントでログイン"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
              />
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default Signin;
