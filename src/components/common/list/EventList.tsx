import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
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

const EventList: FC<{ events: Event[] }> = ({ events }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        {events.map((event) => (
          <ListItem button key={event.id}>
            <EventName event={event} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );
};

export default EventList;
