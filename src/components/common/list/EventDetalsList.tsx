import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { List, ListItem } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import EventDetailText from "components/common/atoms/EventDetailText";
import { EventDetail } from "services/hello-calendar/models/eventDetail";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

const EventDetalsList: FC<{ eventDetails: EventDetail[] }> = ({
  eventDetails,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        {eventDetails.map((detail) => (
          <>
            <ListItem key={detail.id} divider>
              <EventDetailText detail={detail} />
            </ListItem>
          </>
        ))}
      </List>
      <Divider />
    </div>
  );
};

export default EventDetalsList;
