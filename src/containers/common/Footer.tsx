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
    privacy: {
      // lineHeight: '100px',
      paddingTop: "50px",
    },
    copy: {
      paddingBottom: "50px",
    },
    footer: {
      flexShrink: 0,
      textAlign: "center",
      height: "100px",
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
      <footer className={classes.footer}>
        <Box>
          <Container maxWidth="lg">
            <Link to="/privacy">
              <Typography
                color="textSecondary"
                variant="body2"
                className={classes.privacy}
              >
                プライバシーポリシー
              </Typography>
            </Link>
            <Typography
              color="textSecondary"
              variant="body2"
              className={classes.copy}
            >
              ©Hellocale
            </Typography>
          </Container>
        </Box>
      </footer>
    </div>
  );
};

export default Footer;
