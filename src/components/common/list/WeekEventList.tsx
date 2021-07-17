import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { Typography } from "@material-ui/core";
import WeekEventListItem from "./WeekEventListItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      marginTop: "10px",
    },
    title: {
      fontSize: "medium",
    },
  })
);

const WeekEventList: FC<{ title: string; events: EventDetail[] }> = React.memo(
  ({ title, events }) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <Typography color="inherit" className={classes.title}>
          <strong>{title}</strong>
        </Typography>
        <List component="nav" aria-label="main mailbox folders">
          {events.map((detail) => (
            <>
              <WeekEventListItem event={detail} />
            </>
          ))}
        </List>
        <Divider />
      </div>
    );
  }
);

export default WeekEventList;
