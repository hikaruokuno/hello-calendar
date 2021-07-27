import React, { FC } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
  })
);

const CircularIndeterminate: FC<{ size?: number }> = (size) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={!Object.keys(size).length ? 40 : 20} />
    </div>
  );
};

export default CircularIndeterminate;
