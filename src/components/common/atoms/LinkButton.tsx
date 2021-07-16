import React, { FC } from "react";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      paddingTop: "8px",
    },
  })
);

const LinkButton: FC<{ url: string }> = ({ url }) => {
  const classes = useStyles();

  const pushEventTracking = () => {
    window.gtag("event", "calendar_click", {
      event_category: "outbound",
      event_label: url,
    });
  };

  return (
    <div className={classes.root}>
      <Button
        size="medium"
        variant="outlined"
        color="primary"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={pushEventTracking}
      >
        <CalendarTodayIcon fontSize="small" />
        &nbsp;Googleカレンダーに追加する
      </Button>
    </div>
  );
};
export default LinkButton;
