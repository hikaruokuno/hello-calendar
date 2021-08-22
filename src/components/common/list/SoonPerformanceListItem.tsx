import React, { FC } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import TweetButton from "components/Details/TweetButton";
import { isToday } from "date-fns";
import { getTime } from "components/item-tools";

const useStyles = makeStyles(() =>
  createStyles({
    primary: {
      color: "black",
      fontWeight: "bold",
      fontSize: "smaller",
    },
    secondary: {
      fontSize: "small",
    },
    listItem: {
      paddingTop: "0px",
      paddingBottom: "0px",
    },
    icon: {
      minWidth: "0px",
    },
  })
);

const SoonPerformanceListItem: FC<{ event: EventDetail }> = ({ event }) => {
  const classes = useStyles();
  let subTitle = "";
  const performanceDate = event.performanceDate!.toDate();
  let color: "secondary" | "textPrimary" | "textSecondary";

  if (isToday(performanceDate)) {
    subTitle = ` [本日 ${getTime(event)}〜]`;
    color = "secondary";
  } else {
    const MMdd = event.performanceDay.substring(
      5,
      event.performanceDay.indexOf("(")
    );
    subTitle = ` [${MMdd} ${getTime(event)}〜]`;
    color = "textSecondary";
  }

  return (
    <>
      <ListItem key={event.id} className={classes.listItem} divider>
        <ListItemText
          primary={
            <>
              {event.title}
              <Typography component="span" variant="body2" color={color}>
                {subTitle}
              </Typography>
            </>
          }
          classes={{
            primary: classes.primary,
            secondary: classes.secondary,
          }}
        />
        {isToday(performanceDate) ? (
          <ListItemIcon className={classes.icon}>
            <TweetButton detail={event} type="top" />
          </ListItemIcon>
        ) : (
          ""
        )}
      </ListItem>
    </>
  );
};

export default SoonPerformanceListItem;
