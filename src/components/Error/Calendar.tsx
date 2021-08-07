import React, { FC } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";

import ErrorIcon from "@material-ui/icons/Error";
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

const Calendar: FC = () => {
  const classes = useStyles();

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <ErrorIcon />
          </Avatar>
          <>
            <Typography component="h1" variant="h5" className={classes.title}>
              カレンダーに追加できませんでした。
            </Typography>
            <Typography variant="body1" className={classes.subTitle}>
              ログアウトして、もう一度ログインしてください。
            </Typography>
          </>
        </div>
      </Container>
    </>
  );
};

export default Calendar;
