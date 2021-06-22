import React, { FC } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

const DenseAppBar: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          />
          <Typography variant="h5" color="inherit">
            <strong>ハロカレ</strong>
          </Typography>
          <Typography variant="subtitle2" color="inherit">
            &nbsp;&nbsp;&nbsp;&nbsp;ハロプロFCの
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;イベント情報サイト
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default DenseAppBar;
