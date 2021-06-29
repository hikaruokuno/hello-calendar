import React, { FC } from "react";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      margin: "8px",
      textAlign: "center",
    },
  })
);

const MoreLinkButton: FC<{ url: string }> = ({ url }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button size="medium" variant="outlined" href={url} fullWidth>
        もっと見る
      </Button>
    </div>
  );
};
export default MoreLinkButton;
