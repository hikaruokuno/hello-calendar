import React, { FC } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { ListItem, ListItemText, Typography } from "@material-ui/core";
import { Event } from "services/hello-calendar/models/event";
import { isToday } from "date-fns";

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

const EventName: FC<{ event: Event }> = ({ event }) => {
  const classes = useStyles();
  let subTitle = "";
  let primaryColor: "primary" | "secondary" | "textSecondary";
  let secondaryColor: "secondary" | "textSecondary" = "textSecondary";
  let secondary = "";

  const isOpenAppryPeriod =
    event.applyStartDate!.toDate() <= new Date() && !event.isApplyEnded;
  const isOpenConfirmPeriod =
    event.confirmStartDate!.toDate() <= new Date() && !event.isConfirmEnded;
  if (isOpenAppryPeriod) {
    subTitle = " [受付中]";
    primaryColor = "secondary";
    secondary = `申込期限: ${event.applyPeriodStr.substring(
      event.applyPeriodStr.indexOf("～") + 1
    )}`;
    if (isToday(event.applyEndDate!.toDate())) {
      secondaryColor = "secondary";
    }
  } else if (isOpenConfirmPeriod) {
    subTitle = " [当落確認期間中]";
    primaryColor = "primary";
    secondary = `支払期限: ${event.paymentDateStr}`;
    if (event.paymentDate! && isToday(event.paymentDate.toDate())) {
      secondaryColor = "secondary";
    }
  } else {
    subTitle = " [受付終了]";
    primaryColor = "textSecondary";
    if (!event.isConfirmEnded) {
      secondary = `当落確認開始: ${event.confirmPeriodStr.substring(
        0,
        event.confirmPeriodStr.indexOf("～") + 1
      )}`;
    }
  }

  return (
    <Link to={`details/${event.type}/${event.id}`}>
      <ListItem button key={event.id} divider>
        <ListItemText
          primary={
            <>
              {event.title}
              <Typography component="span" variant="body2" color={primaryColor}>
                <strong>{subTitle}</strong>
              </Typography>
            </>
          }
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                color={secondaryColor}
              >
                {secondary}
              </Typography>
            </>
          }
          classes={{ primary: classes.primary, secondary: classes.secondary }}
        />
      </ListItem>
    </Link>
  );
};

export default EventName;
