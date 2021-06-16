import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import EventDetailText from "components/common/atoms/EventDetailText";
import AddCalendarButton from "components/Details/AddCalendarButton";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import TweetButton from "components/Details/TweetButton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

const EventDetalsList: FC<{ title: string; eventDetails: EventDetail[] }> = ({
  title,
  eventDetails,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        {eventDetails.map((detail) => (
          <>
            <ListItem key={detail.id}>
              <EventDetailText detail={detail} />
            </ListItem>
            <AddCalendarButton title={title} detail={detail} />
            <TweetButton title={title} detail={detail} />
          </>
        ))}
      </List>
      <Divider />
    </div>
  );
};

export default EventDetalsList;
