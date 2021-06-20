import React, { FC } from "react";
import { Link } from "react-router-dom";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Event } from "services/hello-calendar/models/event";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import Typography from "@material-ui/core/Typography";

const EventName: FC<{ event: Event }> = ({ event }) => {
  let subTitle = "";
  let secondary = "";

  let color:
    | "initial"
    | "inherit"
    | "primary"
    | "secondary"
    | "textPrimary"
    | "textSecondary"
    | "error";

  const isOpenAppryPeriod =
    event.applyStartDate!.toDate() <= new Date() && !event.isApplyEnded;
  const isOpenConfirmPeriod =
    event.confirmStartDate!.toDate() <= new Date() && !event.isConfirmEnded;
  if (isOpenAppryPeriod) {
    subTitle = " [受付中]";
    secondary = `申込期日: ${event.applyPeriodStr.substring(
      event.applyPeriodStr.indexOf("～") + 1
    )}`;
    color = "secondary";
  } else if (isOpenConfirmPeriod) {
    // subTitle = " [当落確認期間中]";
    color = "initial";
    secondary = `入金締切日: ${event.paymentDateStr}`;
  } else {
    subTitle = " [受付終了]";
    color = "textSecondary";
  }

  return (
    <Link to={`details/${event.type}/${event.id}`}>
      <ListItem button key={event.id}>
        <ListItemIcon>
          <AssignmentOutlinedIcon fontSize="large" />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              {event.title}
              <Typography component="span" variant="body2" color={color}>
                {subTitle}
              </Typography>
            </>
          }
          secondary={secondary}
        />
      </ListItem>
    </Link>
  );
};

export default EventName;
