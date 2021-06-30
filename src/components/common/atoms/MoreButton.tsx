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

const MoreButton: FC<{ onClick: () => void; end: boolean }> = ({
  onClick,
  end,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {end ? (
        ""
      ) : (
        <Button size="medium" variant="outlined" fullWidth onClick={onClick}>
          もっと見る
        </Button>
      )}
    </div>
  );
};
export default MoreButton;
