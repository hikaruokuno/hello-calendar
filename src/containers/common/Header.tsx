import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SearchHeadForm from "components/Search/SearchHeadForm";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      display: "block",
    },
    subTitle: {
      flexGrow: 1,
      display: "block",
    },
  })
);

const DenseAppBar: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" />
          <Typography
            className={classes.title}
            variant="h5"
            color="inherit"
            noWrap
          >
            <strong>ハロカレ</strong>
          </Typography>
          <Typography
            className={classes.subTitle}
            variant="subtitle2"
            color="inherit"
            noWrap
          >
            &nbsp;&nbsp;&nbsp;&nbsp;ハロプロの
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;FCイベント情報サイト
          </Typography>
          <SearchHeadForm />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default DenseAppBar;
