import React, { FC } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { EventDetail } from "services/hello-calendar/models/eventDetail";
import { Grid, Typography } from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
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
    divider: {
      backgroundColor: "black",
    },
  })
);

const WeekEventList: FC<{ title: string; events: EventDetail[] }> = React.memo(
  ({ title, events }) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <br />
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <LaunchIcon fontSize="small" color="inherit" />
          </Grid>
          <Typography color="inherit" className={classes.title}>
            &nbsp;<strong>{title}</strong>
          </Typography>
        </Grid>
        <Divider className={classes.divider} />
        <List component="nav" aria-label="main mailbox folders">
          {events.map((detail) => (
            <>
              <WeekEventListItem event={detail} />
            </>
          ))}
        </List>
      </div>
    );
  }
);

export default WeekEventList;
