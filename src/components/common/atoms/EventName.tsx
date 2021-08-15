import React, { FC } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { ListItem, ListItemText, Typography } from "@material-ui/core";
import { Event } from "services/hello-calendar/models/event";
import { isToday, isTomorrow } from "date-fns";

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
  let color: "primary" | "secondary" | "textSecondary";
  let secondary = "";

  const isOpenAppryPeriod =
    event.applyStartDate!.toDate() <= new Date() && !event.isApplyEnded;
  const isOpenConfirmPeriod =
    event.confirmStartDate!.toDate() <= new Date() && !event.isConfirmEnded;
  if (isOpenAppryPeriod) {
    if (isToday(event.applyEndDate!.toDate())) {
      subTitle = " [受付中（本日締切）]";
    } else {
      subTitle = " [受付中]";
    }
    color = "secondary";
    secondary = `申込期限: ${event.applyPeriodStr.substring(
      event.applyPeriodStr.indexOf("～") + 1
    )}`;
  } else if (isOpenConfirmPeriod) {
    if (event.paymentDate! && isTomorrow(event.paymentDate.toDate())) {
      subTitle = " [当落確認期間中（本日支払期日）]";
    } else {
      subTitle = " [当落確認期間中]";
    }
    color = "primary";
    secondary = `支払期限: ${event.paymentDateStr}`;
  } else {
    subTitle = " [受付終了]";
    color = "textSecondary";
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
              <Typography component="span" variant="body2" color={color}>
                <strong>{subTitle}</strong>
              </Typography>
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
