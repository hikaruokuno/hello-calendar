import React, { FC } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { ListItem, ListItemText, Typography } from "@material-ui/core";
import { Event } from "services/hello-calendar/models/event";
import { FiberNew } from "@material-ui/icons";
import { differenceInCalendarDays, format } from "date-fns";

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
    itemIcon: {
      minWidth: "40px",
    },
  })
);

const NewEventName: FC<{ event: Event }> = ({ event }) => {
  const classes = useStyles();
  const customTitle =
    event.title.length > 40
      ? `${event.title.substring(0, 40)}...`
      : event.title;
  const subTitle = event.type === "hello" ? "[ ﾊﾛﾌﾟﾛ ] " : "[ M-line ] ";
  const secondary = `[${format(
    event.createdAt!.toDate(),
    "yyyy-MM-dd HH:mm"
  )}]`;
  const newTitle =
    differenceInCalendarDays(
      new Date(),
      new Date(event.applyStartDate!.toDate())
    ) <= 0;

  return (
    <Link to={`details/${event.type}/${event.id}`}>
      <ListItem button key={event.id} divider>
        <ListItemText
          primary={
            <>
              <Typography component="span" variant="body2" color="primary">
                <strong>{subTitle}</strong>
              </Typography>
              {customTitle}
              <Typography
                component="span"
                variant="body2"
                color="textSecondary"
              >
                <strong>{secondary}</strong>
              </Typography>
              {newTitle ? <FiberNew fontSize="small" color="secondary" /> : ""}
            </>
          }
          classes={{ primary: classes.primary, secondary: classes.secondary }}
        />
      </ListItem>
    </Link>
  );
};

export default NewEventName;
