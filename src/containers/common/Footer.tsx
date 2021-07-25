import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";
import { Link } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    text: {
      lineHeight: "100px",
    },
    footer: {
      flexShrink: 0,
      textAlign: "center",
      height: "100px",
    },
  })
);

const Footer: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Box>
          <Container maxWidth="lg">
            <Link to="privacy">
              <Typography
                color="textSecondary"
                variant="body2"
                className={classes.text}
              >
                プライバシーポリシー
              </Typography>
            </Link>
          </Container>
        </Box>
      </footer>
    </div>
  );
};

export default Footer;
