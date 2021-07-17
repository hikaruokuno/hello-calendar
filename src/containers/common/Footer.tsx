import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

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

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar className={classes.toolBar} />
      </AppBar>
    </div>
  );
};

export default Footer;
