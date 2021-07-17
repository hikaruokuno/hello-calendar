import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { TwitterIcon, TwitterShareButton } from "react-share";
// import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      minHeight: "100px",
    },
    title: {
      display: "block",
      fontSize: "medium",
    },
    toolBar: {
      minHeight: "100px",
    },
    tweet: {
      flexGrow: 1,
      marginBottom: "40px",
    },
  })
);

const Footer: FC = () => {
  const classes = useStyles();
  const pushEventTracking = () => {
    window.gtag("event", "tweet_click", {
      event_category: "outbound",
      event_label: "home",
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar className={classes.toolBar}>
          <TwitterShareButton
            url="https://hellocale.com/"
            title="イベントの予定をサクッと確認・登録  忙しいハロヲタのためのFCイベント情報サイト「ハロカレ」"
            onClick={pushEventTracking}
            className={classes.tweet}
          >
            <TwitterIcon size={30} round />
          </TwitterShareButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Footer;
