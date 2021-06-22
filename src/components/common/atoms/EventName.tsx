import React, { FC } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Event } from "services/hello-calendar/models/event";
import { FiberNew, AssignmentOutlined } from "@material-ui/icons";
import { differenceInCalendarDays } from "date-fns";

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
  })
);

const EventName: FC<{ event: Event }> = ({ event }) => {
  const classes = useStyles();
  let secondary = "";
  let newTitle = false;

  const isOpenAppryPeriod =
    event.applyStartDate!.toDate() <= new Date() && !event.isApplyEnded;
  const isOpenConfirmPeriod =
    event.confirmStartDate!.toDate() <= new Date() && !event.isConfirmEnded;
  if (isOpenAppryPeriod) {
    secondary = `申込期日: ${event.applyPeriodStr.substring(
      event.applyPeriodStr.indexOf("～") + 1
    )}`;

    newTitle =
      differenceInCalendarDays(
        new Date(),
        new Date(event.applyStartDate!.toDate())
      ) <= 3;
  } else if (isOpenConfirmPeriod) {
    secondary = `入金締切日: ${event.paymentDateStr}`;

    newTitle =
      differenceInCalendarDays(
        new Date(),
        new Date(event.confirmStartDate!.toDate())
      ) <= 3;
  }

  return (
    <Link to={`details/${event.type}/${event.id}`}>
      <ListItem button key={event.id} divider>
        <ListItemIcon>
          <AssignmentOutlined fontSize="large" color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              {event.title}
              {newTitle ? <FiberNew fontSize="small" color="secondary" /> : ""}
            </>
          }
          secondary={secondary}
          classes={{ primary: classes.primary, secondary: classes.secondary }}
        />
      </ListItem>
    </Link>
  );
};

export default EventName;
