import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Signin from "components/Signin";
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
  })
);

const Footer: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar className={classes.toolBar}>
          {/* <Typography
            className={classes.title}
            variant="h5"
            color="inherit"
            noWrap
          >
            <strong>Footer</strong>
          </Typography> */}
          <Signin />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Footer;
