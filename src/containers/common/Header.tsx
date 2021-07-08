import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SearchHeadForm from "components/Search/SearchHeadForm";
import { useNavigate, useLocation } from "react-router";
import { Container } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
      position: "relative",
    },
    title: {
      display: "block",
      fontSize: "large",
      transform: "rotate(-5deg)",
      marginLeft: "2px",
    },
    subTitle: {
      display: "block",
      fontSize: "x-small",
      marginLeft: "-5px",
    },
    dammy: {
      flexGrow: 1,
    },
    toolBar: {
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    iconButton: {
      marginLeft: "-18px",
      position: "absolute",
    },
  })
);

const DenseAppBar: FC = () => {
  const classes = useStyles();
  const navigete = useNavigate();
  const path = useLocation().pathname;

  const onClickHome = () => (path === "/" ? false : navigete("/"));

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Container>
          <Toolbar className={classes.toolBar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="home"
              onClick={() => onClickHome()}
              className={classes.iconButton}
            >
              <img
                src={`${process.env.PUBLIC_URL}/logo.svg`}
                alt="Logo"
                width="40"
                height="40"
              />
              <Typography
                className={classes.title}
                variant="h5"
                color="inherit"
                noWrap
              >
                <strong>
                  ハロ
                  <br />
                  カレ
                </strong>
              </Typography>
              <Typography
                className={classes.subTitle}
                variant="subtitle2"
                color="inherit"
                noWrap
              >
                &nbsp;&nbsp;&nbsp;&nbsp;忙しいハロヲタのための
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;FCイベント情報サイト
              </Typography>
            </IconButton>
            <div className={classes.dammy} />
            <SearchHeadForm />
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default DenseAppBar;
