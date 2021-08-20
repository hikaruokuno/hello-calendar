import React, { FC } from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  border: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12);",
    width: "100%",
  },
  content: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    fontWeight: 500,
    fontSize: 18,
    color: "lightgray",
  },
}));

const DividerWithText: FC<{ text: string }> = ({ text }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.border} />
      <span className={classes.content}>{text}</span>
      <div className={classes.border} />
    </div>
  );
};
export default DividerWithText;
