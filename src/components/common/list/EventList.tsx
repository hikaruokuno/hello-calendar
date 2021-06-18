import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import EventName from "components/common/atoms/EventName";
import { Event } from "services/hello-calendar/models/event";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

const EventList: FC<{ title: string; events: Event[] }> = ({
  title,
  events,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h4>{title}</h4>
      <List component="nav" aria-label="main mailbox folders">
        {events.map((event) => (
          <EventName event={event} />
        ))}
      </List>
      <Divider />
    </div>
  );
};

export default EventList;
