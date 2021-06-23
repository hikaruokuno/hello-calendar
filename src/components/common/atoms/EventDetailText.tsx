import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ListItemText, ListItemIcon } from "@material-ui/core";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import AddCalendarButton from "components/Details/AddCalendarButton";
import TweetButton from "components/Details/TweetButton";

const useStyles = makeStyles(() =>
  createStyles({
    primary: {
      color: "black",
      fontWeight: "bold",
      fontSize: "large",
    },
    secondary: {
      color: "black",
      fontSize: "inherit",
    },
    listItem: {
      paddingTop: "0px",
      paddingBottom: "0px",
    },
    tweet: {
      padding: "5px 0px 0px 5px",
    },
  })
);

const EventDetailText: FC<{ detail: EventDetail }> = ({ detail }) => {
  const classes = useStyles();

  return (
    <>
      <ListItemText
        primary={`${detail.performanceDay}`}
        secondary={
          <>
            会場: {detail.venue}
            <br />
            {detail.performer ? (
              <>
                {detail.performer}
                <br />
              </>
            ) : (
              ""
            )}
            {detail.openText}: {detail.openingTime}
            <br />
            {detail.showText}: {detail.showTime}
            {detail.otherText && detail.otherDetail ? (
              <>
                <br />
                {detail.otherText}: {detail.otherDetail}
              </>
            ) : (
              <>
                <br />
                {detail.otherText}
              </>
            )}
            {detail.openText.includes("開演") &&
            detail.showText.includes("開演") ? (
              ""
            ) : (
              <ListItemIcon>
                <AddCalendarButton detail={detail} />
                <div className={classes.tweet}>
                  <TweetButton detail={detail} />
                </div>
              </ListItemIcon>
            )}
          </>
        }
        classes={{ primary: classes.primary, secondary: classes.secondary }}
      />
    </>
  );
};

export default EventDetailText;
