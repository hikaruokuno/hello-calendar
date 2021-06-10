import React, { FC } from "react";
import { Link } from "react-router-dom";
import ListItemText from "@material-ui/core/ListItemText";
import { Event } from "services/hello-calendar/models/event";

const EventName: FC<{ event: Event }> = ({ event }) => (
  <Link to={`/details/${event.id}`}>
    <ListItemText primary={event.title} />
  </Link>
);

export default EventName;
