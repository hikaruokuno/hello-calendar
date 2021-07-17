import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import EventName from "components/common/atoms/EventName";
import { Event } from "services/hello-calendar/models/event";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      fontSize: "medium",
    },
  })
);

const EventList: FC<{ title: string; events: Event[]; arrayCount: number }> =
  React.memo(({ title, events, arrayCount }) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <br />
        <Typography color="inherit" className={classes.title}>
          <strong>{title}</strong>
        </Typography>
        <List component="nav" aria-label="main mailbox folders">
          {events.slice(0, arrayCount).map((event) => (
            <EventName event={event} />
          ))}
        </List>
        <Divider />
      </div>
    );
  });

export default EventList;
