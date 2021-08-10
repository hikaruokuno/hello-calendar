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

const MoreButton: FC<{ onClick: () => void; count: number }> = React.memo(
  ({ onClick, count }) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        {count === 30 ? (
          <Button size="medium" variant="outlined" fullWidth onClick={onClick}>
            表示数を減らす
          </Button>
        ) : (
          <Button size="medium" variant="outlined" fullWidth onClick={onClick}>
            もっと見る
          </Button>
        )}
      </div>
    );
  }
);
export default MoreButton;
