import React, { FC } from "react";
import Typography from "@material-ui/core/Typography";
import { Event } from "services/hello-calendar/models/event";

const ListItemTypo: FC<{ event: Event }> = ({ event }) => {
  let text = "";
  const isOpenAppryPeriod =
    event.applyStartDate!.toDate() <= new Date() && !event.isApplyEnded;
  if (isOpenAppryPeriod) {
    text = "[受付中]";
  }

  return (
    <Typography component="span" variant="body2" color="secondary">
      {text}
    </Typography>
  );
};

export default ListItemTypo;
